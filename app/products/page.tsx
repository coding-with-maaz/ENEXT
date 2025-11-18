'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import '../globals.css';
import { API_ENDPOINTS, UI_MESSAGES, BUTTON_LABELS, PAGE_TITLES, FORM_LABELS } from '@/lib/client-constants';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  created_at: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.PRODUCTS);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error(UI_MESSAGES.ERRORS.FETCH, error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingProduct ? `${API_ENDPOINTS.PRODUCTS}/${editingProduct.id}` : API_ENDPOINTS.PRODUCTS;
      const method = editingProduct ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        fetchProducts();
        setShowForm(false);
        setEditingProduct(null);
        setFormData({ name: '', description: '', price: '', stock: '' });
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(UI_MESSAGES.ERRORS.SAVE, error);
      alert(UI_MESSAGES.ERRORS.SAVE);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      stock: product.stock.toString(),
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm(UI_MESSAGES.CONFIRM_DELETE.PRODUCT)) return;

    try {
      const res = await fetch(`${API_ENDPOINTS.PRODUCTS}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(UI_MESSAGES.ERRORS.DELETE, error);
      alert(UI_MESSAGES.ERRORS.DELETE);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card">{UI_MESSAGES.LOADING}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/" className="btn btn-secondary">{BUTTON_LABELS.BACK_HOME}</Link>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>{PAGE_TITLES.PRODUCTS}</h1>
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowForm(!showForm);
              setEditingProduct(null);
              setFormData({ name: '', description: '', price: '', stock: '' });
            }}
          >
            {showForm ? BUTTON_LABELS.CANCEL : BUTTON_LABELS.ADD_PRODUCT}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px' }}>
            <h2 style={{ marginBottom: '1rem' }}>{editingProduct ? PAGE_TITLES.EDIT_PRODUCT : PAGE_TITLES.ADD_PRODUCT}</h2>
            <div className="form-group">
              <label>{FORM_LABELS.NAME}</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>{FORM_LABELS.DESCRIPTION}</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>{FORM_LABELS.PRICE}</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>{FORM_LABELS.STOCK}</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {editingProduct ? BUTTON_LABELS.UPDATE_PRODUCT : BUTTON_LABELS.CREATE_PRODUCT}
            </button>
          </form>
        )}

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>{FORM_LABELS.NAME}</th>
              <th>{FORM_LABELS.DESCRIPTION}</th>
              <th>{FORM_LABELS.PRICE}</th>
              <th>{FORM_LABELS.STOCK}</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                  {UI_MESSAGES.NO_DATA.PRODUCTS}
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.description || '-'}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <button
                      className="btn btn-secondary"
                      style={{ marginRight: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                      onClick={() => handleEdit(product)}
                    >
                      {BUTTON_LABELS.EDIT}
                    </button>
                    <button
                      className="btn btn-danger"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                      onClick={() => handleDelete(product.id)}
                    >
                      {BUTTON_LABELS.DELETE}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

