import Link from 'next/link';
import './globals.css';

export default function Home() {
  return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#667eea' }}>
          ENEXT
        </h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem', color: '#6c757d' }}>
          Next.js Application with MySQL Database
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/users" className="btn btn-primary">
            Manage Users
          </Link>
          <Link href="/products" className="btn btn-primary">
            Manage Products
          </Link>
          <Link href="/orders" className="btn btn-primary">
            View Orders
          </Link>
        </div>

        <div style={{ marginTop: '3rem', padding: '2rem', background: '#f8f9fa', borderRadius: '8px' }}>
          <h2 style={{ marginBottom: '1rem' }}>Features</h2>
          <ul style={{ listStyle: 'none', textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
            <li style={{ padding: '0.5rem 0' }}>✅ Next.js 14 with App Router</li>
            <li style={{ padding: '0.5rem 0' }}>✅ MySQL Database Integration</li>
            <li style={{ padding: '0.5rem 0' }}>✅ TypeScript Support</li>
            <li style={{ padding: '0.5rem 0' }}>✅ RESTful API Routes</li>
            <li style={{ padding: '0.5rem 0' }}>✅ CRUD Operations</li>
            <li style={{ padding: '0.5rem 0' }}>✅ Modern UI Design</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

