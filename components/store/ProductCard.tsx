'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Tag } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store';
import { addToCart } from '@/store/slices/cartSlice';
import { cn, formatPrice } from '@/lib/utils';
import type { Product } from '@/types';
import toast from 'react-hot-toast';

interface Props {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((s) => s.auth);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error('Please log in to add items to cart');
      return;
    }
    const result = await dispatch(addToCart({ productId: product._id }));
    if (addToCart.fulfilled.match(result)) {
      toast.success(`${product.name} added to cart!`, {
        icon: '🛒',
        style: { borderRadius: '12px', background: '#333', color: '#fff' },
      });
    } else {
      toast.error((result.payload as string) ?? 'Failed to add to cart');
    }
  };

  const mainImage = product.images?.[0];
  const imgSrc    = mainImage?.url
    ? `${process.env.NEXT_PUBLIC_API_URL}${mainImage.url}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -6 }}
      className="group"
    >
      <Link href={`/products/${product._id}`}>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100">
          {/* Image */}
          <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
            {imgSrc ? (
              <Image
                src={imgSrc}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#d4cdc9] to-[#e8e3e1] rounded-full flex items-center justify-center">
                  <Tag className="w-8 h-8 text-[#9c9694]" />
                </div>
              </div>
            )}

            {/* Discount Badge */}
            {product.discountPercentage > 0 && (
              <div className="absolute top-3 left-3">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md"
                >
                  -{product.discountPercentage}%
                </motion.span>
              </div>
            )}

            {/* Out of stock */}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="bg-white text-gray-800 font-bold text-sm px-4 py-2 rounded-full">
                  Out of Stock
                </span>
              </div>
            )}

            {/* Wishlist */}
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => e.preventDefault()}
              className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Heart className="w-4 h-4 text-gray-500 hover:text-red-500 transition-colors" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Collection */}
            {product.category && (
              <span className="text-xs font-medium text-[#736e6c] uppercase tracking-wide">
                {typeof product.category === 'string' ? product.category : product.category.name}
              </span>
            )}

            <h3 className="mt-1 font-semibold text-gray-800 group-hover:text-[#736e6c] transition-colors line-clamp-2 text-sm leading-snug">
              {product.name}
            </h3>

            {/* Rating mock */}
            <div className="flex items-center gap-1 mt-1.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'w-3 h-3',
                    i < 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'
                  )}
                />
              ))}
              <span className="text-xs text-gray-400 ml-1">(4.0)</span>
            </div>

            {/* Price + Add to cart */}
            <div className="flex items-center justify-between mt-3">
              <div>
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(product.discountPrice ?? product.price)}
                </span>
                {product.discountPrice && (
                  <span className="ml-2 text-sm text-gray-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center transition-all',
                  product.stock === 0
                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                    : 'bg-[#736e6c] text-white hover:bg-[#4a4442] shadow-md shadow-[#d4cdc9]'
                )}
              >
                <ShoppingCart className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Stock indicator */}
            {product.stock > 0 && product.stock <= 10 && (
              <p className="text-xs text-orange-500 font-medium mt-2">
                Only {product.stock} left!
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
