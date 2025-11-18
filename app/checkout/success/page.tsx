'use client';

import Link from 'next/link';

export default function CheckoutSuccessPage() {
  return (
    <div style={{ padding: '4rem 0', textAlign: 'center' }}>
      <div className="container">
        <div
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: '3rem',
            background: 'var(--white)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              background: 'var(--success)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2rem',
              fontSize: '3rem',
            }}
          >
            ✓
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Order Placed Successfully!
          </h1>
          <p style={{ color: 'var(--gray-600)', marginBottom: '2rem', fontSize: '1.125rem' }}>
            Thank you for your purchase. We've sent a confirmation email with your order details.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/shop" className="btn btn-primary btn-lg">
              Continue Shopping
            </Link>
            <Link href="/orders" className="btn btn-outline btn-lg">
              View Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

