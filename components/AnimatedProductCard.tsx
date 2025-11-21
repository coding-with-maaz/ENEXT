'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, Check, Package, Sparkles, Star } from 'lucide-react';
import { getProductImage } from '@/lib/product-images';
import { getProductUrl } from '@/lib/product-url';

interface AnimatedProductCardProps {
  id: number;
  name: string;
  slug?: string;
  description: string;
  short_description?: string;
  price: number | string;
  stock: number;
  image?: string;
  image_url?: string;
}

export default function AnimatedProductCard({
  id,
  name,
  slug,
  description,
  short_description,
  price,
  stock,
  image,
  image_url,
}: AnimatedProductCardProps) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const priceNum = typeof price === 'string' ? parseFloat(price) : price;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAdding(true);
    addToCart({ id, name, price: priceNum, image });
    
    setTimeout(() => {
      setIsAdding(false);
    }, 800);
  };

  return (
    <div
      className="group h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-full bg-white/95 backdrop-blur-md rounded-3xl border-2 border-gray-200/50 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 flex flex-col group/card">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/8 group-hover:via-purple-500/8 group-hover:to-pink-500/8 transition-all duration-500 pointer-events-none z-10"></div>
        
        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500 rounded-bl-full pointer-events-none z-10"></div>
        
        <Link href={getProductUrl({ id, slug })} className="flex flex-col h-full">
          {/* Image Section */}
          <div className="relative w-full h-56 sm:h-64 md:h-72 bg-gradient-to-br from-gray-50 via-gray-100 to-blue-50 overflow-hidden">
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/15 group-hover:via-purple-500/15 group-hover:to-pink-500/15 transition-all duration-500"></div>
            
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, rgb(59 130 246 / 0.1) 1px, transparent 0)`,
                backgroundSize: '20px 20px'
              }}></div>
            </div>
            
            <img
              src={image || image_url || getProductImage(name, id)}
              alt={name}
              className={`w-full h-full object-cover transition-all duration-700 ${
                isHovered ? 'scale-110 rotate-1' : 'scale-100 rotate-0'
              }`}
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                target.src = getProductImage(name, id);
              }}
            />
            
            {/* Stock Badge */}
            {stock === 0 ? (
              <div className="absolute top-4 right-4 z-20">
                <div className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full text-xs font-bold shadow-xl backdrop-blur-sm border border-red-400/50 animate-pulse">
                  Out of Stock
                </div>
              </div>
            ) : (
              <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-xs font-bold shadow-xl backdrop-blur-sm border border-green-400/50 flex items-center gap-1.5">
                  <Package className="w-3 h-3" />
                  <span>{stock} in stock</span>
                </div>
              </div>
            )}

            {/* Premium Badge */}
            <div className="absolute top-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <div className="px-3 py-1.5 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white rounded-full text-xs font-bold shadow-xl backdrop-blur-sm border border-yellow-300/50 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                <span>Premium</span>
              </div>
            </div>

            {/* Hover overlay with shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </div>

          {/* Content Section */}
          <div className="p-5 sm:p-6 flex-1 flex flex-col relative z-10 bg-gradient-to-b from-transparent to-white/50">
            {/* Category/Tag */}
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 text-blue-600 rounded-lg text-xs font-bold border border-blue-100 shadow-sm">
                Premium
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-3 h-3 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
            </div>

            {/* Title */}
            <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 mb-2 line-clamp-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-300">
              {name}
            </h3>
            
            {/* Description */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1 leading-relaxed">
              {short_description || description || 'Premium quality product with exceptional features and design.'}
            </p>

            {/* Price and Action Section */}
            <div className="mt-auto pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between gap-4">
                {/* Price */}
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      ${priceNum.toFixed(2)}
                    </span>
                  </div>
                  {stock > 0 && (
                    <span className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      {stock} available
                    </span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={stock === 0 || isAdding}
                  className={`relative px-5 py-3 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden group/btn ${
                    isAdding
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                      : stock === 0
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-xl hover:shadow-2xl'
                  }`}
                >
                  {/* Button shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                  
                  <span className="relative flex items-center gap-2">
                    {isAdding ? (
                      <>
                        <Check className="w-4 h-4 animate-pulse" />
                        <span>Added!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span className="hidden sm:inline">Add to Cart</span>
                        <span className="sm:hidden">Add</span>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom accent line on hover */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
        </Link>
      </div>
    </div>
  );
}
