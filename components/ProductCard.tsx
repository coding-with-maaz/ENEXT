'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string;
}

export default function ProductCard({ id, name, description, price, stock, image }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ id, name, price, image });
  };

  return (
    <div className="card-product">
      <Link href={`/product/${id}`}>
        <div
          style={{
            width: '100%',
            height: '250px',
            background: 'linear-gradient(135deg, var(--gray-100) 0%, var(--gray-200) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {image ? (
            <img
              src={image}
              alt={name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div
              style={{
                fontSize: '3rem',
                color: 'var(--gray-400)',
              }}
            >
              🛍️
            </div>
          )}
          {stock === 0 && (
            <div
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'var(--danger)',
                color: 'var(--white)',
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius)',
                fontSize: '0.875rem',
                fontWeight: '600',
              }}
            >
              Out of Stock
            </div>
          )}
        </div>
        <div style={{ padding: '1.5rem' }}>
          <h3
            style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: 'var(--gray-900)',
            }}
          >
            {name}
          </h3>
          <p
            style={{
              color: 'var(--gray-600)',
              fontSize: '0.875rem',
              marginBottom: '1rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {description || 'No description available'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: 'var(--primary)',
                }}
              >
                ${price.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={stock === 0}
              className="btn btn-primary btn-sm"
              style={{
                opacity: stock === 0 ? 0.5 : 1,
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}

