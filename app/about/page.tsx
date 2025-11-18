export default function AboutPage() {
  return (
    <div style={{ padding: '4rem 0' }}>
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>
            About ENEXT
          </h1>
          <div style={{ lineHeight: '1.8', color: 'var(--gray-700)' }}>
            <p style={{ marginBottom: '1.5rem', fontSize: '1.125rem' }}>
              Welcome to ENEXT, your trusted destination for quality products and exceptional shopping experiences.
            </p>
            <p style={{ marginBottom: '1.5rem' }}>
              Founded with a vision to revolutionize online shopping, ENEXT brings you a curated selection of
              products that combine quality, style, and value. We believe that everyone deserves access to
              great products at fair prices.
            </p>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '3rem', marginBottom: '1rem' }}>
              Our Mission
            </h2>
            <p style={{ marginBottom: '1.5rem' }}>
              Our mission is to provide customers with an unparalleled shopping experience through:
            </p>
            <ul style={{ marginLeft: '2rem', marginBottom: '1.5rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>High-quality products at competitive prices</li>
              <li style={{ marginBottom: '0.5rem' }}>Fast and reliable shipping</li>
              <li style={{ marginBottom: '0.5rem' }}>Exceptional customer service</li>
              <li style={{ marginBottom: '0.5rem' }}>Secure and easy checkout process</li>
            </ul>
            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '3rem', marginBottom: '1rem' }}>
              Why Choose Us?
            </h2>
            <p style={{ marginBottom: '1.5rem' }}>
              At ENEXT, we're committed to excellence in every aspect of our business. From product selection
              to customer support, we strive to exceed your expectations and make your shopping experience
              enjoyable and hassle-free.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

