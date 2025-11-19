'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface AnimatedProductCardProps {
  id: number;
  name: string;
  description: string;
  price: number | string;
  stock: number;
  image?: string;
}

export default function AnimatedProductCard({
  id,
  name,
  description,
  price,
  stock,
  image,
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
    }, 500);
  };

  return (
    <div
      className="group h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card hover className="overflow-hidden h-full flex flex-col p-0">
        <Link href={`/product/${id}`}>
          <div className="relative w-full h-48 sm:h-56 md:h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden rounded-t-xl">
            {image ? (
              <img
                src={image}
                alt={name}
                className={`w-full h-full object-cover transition-transform duration-500 ${
                  isHovered ? 'scale-110' : 'scale-100'
                }`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl sm:text-5xl md:text-6xl">
                🛍️
              </div>
            )}
            
            {stock === 0 && (
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-red-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                Out of Stock
              </div>
            )}

            <div
              className={`absolute inset-0 bg-black transition-opacity duration-300 ${
                isHovered ? 'opacity-0' : 'opacity-0 group-hover:opacity-10'
              }`}
            />
          </div>

          <div className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">
              {name}
            </h3>
            
            <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 flex-1">
              {description || 'No description available'}
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mt-auto">
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-bold text-blue-600">
                  ${priceNum.toFixed(2)}
                </span>
                {stock > 0 && (
                  <span className="text-xs text-gray-500">
                    {stock} in stock
                  </span>
                )}
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={stock === 0 || isAdding}
                size="sm"
                variant={isAdding ? 'secondary' : 'primary'}
                className="relative overflow-hidden w-full sm:w-auto min-w-[120px]"
              >
                {isAdding ? (
                  <>
                    <span className="animate-spin">✓</span>
                    <span>Added!</span>
                  </>
                ) : (
                  'Add to Cart'
                )}
              </Button>
            </div>
          </div>
        </Link>
      </Card>
    </div>
  );
}

