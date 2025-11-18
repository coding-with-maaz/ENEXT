'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div style={{ padding: '4rem 0' }}>
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
            Contact Us
          </h1>
          <p style={{ textAlign: 'center', color: 'var(--gray-600)', marginBottom: '3rem', fontSize: '1.125rem' }}>
            Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Get in Touch</h2>
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Email</h3>
                <p style={{ color: 'var(--gray-600)' }}>support@enext.com</p>
              </div>
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Phone</h3>
                <p style={{ color: 'var(--gray-600)' }}>+1 (555) 123-4567</p>
              </div>
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Address</h3>
                <p style={{ color: 'var(--gray-600)' }}>
                  123 Commerce Street<br />
                  Business City, BC 12345<br />
                  United States
                </p>
              </div>
            </div>

            <div className="card">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    required
                  />
                </div>
                {submitted && (
                  <div
                    style={{
                      padding: '1rem',
                      background: 'var(--success)',
                      color: 'var(--white)',
                      borderRadius: 'var(--radius)',
                      marginBottom: '1rem',
                    }}
                  >
                    Thank you! Your message has been sent.
                  </div>
                )}
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

