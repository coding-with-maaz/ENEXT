'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const initializeDatabase = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/setup/init', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.data.message || 'Database initialized successfully!');
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setError(data.error || 'Failed to initialize database');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while initializing the database');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '4rem 0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>🚀</div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Database Setup
          </h1>
          <p style={{ color: 'var(--gray-600)', marginBottom: '2rem', fontSize: '1.125rem' }}>
            Initialize your database with all required tables and sample data.
          </p>

          {message && (
            <div
              style={{
                padding: '1rem',
                background: 'var(--success)',
                color: 'var(--white)',
                borderRadius: 'var(--radius)',
                marginBottom: '1.5rem',
              }}
            >
              {message}
            </div>
          )}

          {error && (
            <div
              style={{
                padding: '1rem',
                background: 'var(--danger)',
                color: 'var(--white)',
                borderRadius: 'var(--radius)',
                marginBottom: '1.5rem',
              }}
            >
              {error}
            </div>
          )}

          <button
            onClick={initializeDatabase}
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginBottom: '1rem' }}
          >
            {loading ? 'Initializing...' : 'Initialize Database'}
          </button>

          <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginTop: '2rem' }}>
            This will create all necessary tables and insert sample data.
            <br />
            Make sure your MySQL server is running and your .env file is configured correctly.
          </p>

          <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--gray-50)', borderRadius: 'var(--radius)' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.125rem', fontWeight: '600' }}>
              Alternative: Use Command Line
            </h3>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              You can also initialize the database using:
            </p>
            <code
              style={{
                display: 'block',
                padding: '0.75rem',
                background: 'var(--gray-900)',
                color: 'var(--white)',
                borderRadius: 'var(--radius)',
                fontSize: '0.875rem',
                textAlign: 'left',
              }}
            >
              npm run init-db
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

