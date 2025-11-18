'use client';

import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center' }}>
        <div className="container">
          <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>🛒</div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Your cart is empty</h2>
          <p style={{ color: 'var(--gray-600)', marginBottom: '2rem' }}>
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link href="/shop" className="btn btn-primary btn-lg">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Shopping Cart</h1>
          <button onClick={clearCart} className="btn btn-danger btn-sm">
            Clear Cart
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Cart Items */}
          <div>
            <div className="card" style={{ padding: 0 }}>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '1.5rem',
                    borderBottom: '1px solid var(--gray-200)',
                    display: 'flex',
                    gap: '1.5rem',
                  }}
                >
                  <div
                    style={{
                      width: '120px',
                      height: '120px',
                      background: 'var(--gray-100)',
                      borderRadius: 'var(--radius)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '3rem',
                      flexShrink: 0,
                    }}
                  >
                    🛍️
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                      {item.name}
                    </h3>
                    <p style={{ color: 'var(--gray-600)', marginBottom: '1rem' }}>
                      ${item.price.toFixed(2)} each
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.25rem 0.75rem' }}
                        >
                          -
                        </button>
                        <span style={{ minWidth: '40px', textAlign: 'center', fontWeight: '600' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.25rem 0.75rem' }}
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        color: 'var(--primary)',
                      }}
                    >
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="card" style={{ position: 'sticky', top: '100px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                Order Summary
              </h2>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--gray-600)' }}>Subtotal</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--gray-600)' }}>Shipping</span>
                  <span>Free</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--gray-600)' }}>Tax</span>
                  <span>${(getTotalPrice() * 0.1).toFixed(2)}</span>
                </div>
                <div
                  style={{
                    borderTop: '2px solid var(--gray-200)',
                    marginTop: '1rem',
                    paddingTop: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                  }}
                >
                  <span>Total</span>
                  <span style={{ color: 'var(--primary)' }}>
                    ${(getTotalPrice() * 1.1).toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => router.push('/checkout')}
                className="btn btn-primary"
                style={{ width: '100%', marginBottom: '1rem' }}
              >
                Proceed to Checkout
              </button>
              <Link href="/shop" className="btn btn-outline" style={{ width: '100%', display: 'block', textAlign: 'center' }}>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

