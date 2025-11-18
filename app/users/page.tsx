'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import '../globals.css';
import { API_ENDPOINTS, UI_MESSAGES, BUTTON_LABELS, PAGE_TITLES, FORM_LABELS } from '@/lib/client-constants';

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.USERS);
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
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
      const url = editingUser ? `${API_ENDPOINTS.USERS}/${editingUser.id}` : API_ENDPOINTS.USERS;
      const method = editingUser ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        fetchUsers();
        setShowForm(false);
        setEditingUser(null);
        setFormData({ name: '', email: '' });
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error(UI_MESSAGES.ERRORS.SAVE, error);
      alert(UI_MESSAGES.ERRORS.SAVE);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm(UI_MESSAGES.CONFIRM_DELETE.USER)) return;

    try {
      const res = await fetch(`${API_ENDPOINTS.USERS}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchUsers();
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
          <h1>{PAGE_TITLES.USERS}</h1>
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowForm(!showForm);
              setEditingUser(null);
              setFormData({ name: '', email: '' });
            }}
          >
            {showForm ? BUTTON_LABELS.CANCEL : BUTTON_LABELS.ADD_USER}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8f9fa', borderRadius: '8px' }}>
            <h2 style={{ marginBottom: '1rem' }}>{editingUser ? PAGE_TITLES.EDIT_USER : PAGE_TITLES.ADD_USER}</h2>
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
              <label>{FORM_LABELS.EMAIL}</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {editingUser ? BUTTON_LABELS.UPDATE_USER : BUTTON_LABELS.CREATE_USER}
            </button>
          </form>
        )}

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>{FORM_LABELS.NAME}</th>
              <th>{FORM_LABELS.EMAIL}</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                  {UI_MESSAGES.NO_DATA.USERS}
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-secondary"
                      style={{ marginRight: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                      onClick={() => handleEdit(user)}
                    >
                      {BUTTON_LABELS.EDIT}
                    </button>
                    <button
                      className="btn btn-danger"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                      onClick={() => handleDelete(user.id)}
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

