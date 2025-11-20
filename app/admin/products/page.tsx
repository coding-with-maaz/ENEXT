'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/admin/DataTable';
import FormModal from '@/components/admin/FormModal';
import StatusBadge from '@/components/admin/StatusBadge';
import Button from '@/components/ui/Button';
import { Plus, Package, AlertTriangle, Copy } from 'lucide-react';
import { API_ENDPOINTS } from '@/lib/client-constants';
import { getProductImage } from '@/lib/product-images';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  created_at: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [duplicatingProduct, setDuplicatingProduct] = useState<Product | null>(null);

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
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    try {
      const url = editingProduct
        ? `${API_ENDPOINTS.PRODUCTS}/${editingProduct.id}`
        : API_ENDPOINTS.PRODUCTS;
      const method = editingProduct ? 'PUT' : 'POST';

      // Convert price and stock to numbers
      formData.price = parseFloat(formData.price);
      formData.stock = parseInt(formData.stock);

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        fetchProducts();
        setIsModalOpen(false);
        setEditingProduct(null);
        setDuplicatingProduct(null);
      } else {
        alert(data.message || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('An error occurred while saving the product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDuplicate = (product: Product) => {
    // Create a copy of the product with "Copy of" prefix
    const duplicatedProduct: Product = {
      ...product,
      name: `Copy of ${product.name}`,
    };
    setDuplicatingProduct(duplicatedProduct);
    setEditingProduct(null); // Set to null so it creates a new product
    setIsModalOpen(true);
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete ${product.name}?`)) {
      return;
    }

    try {
      const res = await fetch(`${API_ENDPOINTS.PRODUCTS}/${product.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success) {
        fetchProducts();
      } else {
        alert(data.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('An error occurred while deleting the product');
    }
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setDuplicatingProduct(null);
    setIsModalOpen(true);
  };

  const lowStockProducts = products.filter((p) => p.stock < 10).length;
  const outOfStockProducts = products.filter((p) => p.stock === 0).length;

  const columns = [
    {
      key: 'id',
      header: 'ID',
      sortable: true,
    },
    {
      key: 'name',
      header: 'Product',
      sortable: true,
      render: (product: Product) => {
        const imageUrl = getProductImage(product.name, product.id);
        return (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = getProductImage('default', product.id);
                }}
              />
            </div>
            <div>
              <span className="font-semibold text-gray-900 block">{product.name}</span>
              <span className="text-xs text-gray-500 line-clamp-1">
                {product.description || 'No description'}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: 'price',
      header: 'Price',
      sortable: true,
      render: (product: Product) => (
        <span className="font-bold text-blue-600">${parseFloat(product.price.toString()).toFixed(2)}</span>
      ),
    },
    {
      key: 'stock',
      header: 'Stock',
      sortable: true,
      render: (product: Product) => (
        <div className="flex items-center gap-2">
          <span className={`font-semibold ${
            product.stock === 0
              ? 'text-red-600'
              : product.stock < 10
              ? 'text-yellow-600'
              : 'text-green-600'
          }`}>
            {product.stock}
          </span>
          {product.stock < 10 && product.stock > 0 && (
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
          )}
          {product.stock === 0 && (
            <StatusBadge status="inactive" />
          )}
        </div>
      ),
    },
    {
      key: 'created_at',
      header: 'Created',
      sortable: true,
      render: (product: Product) => (
        <span className="text-gray-600">
          {new Date(product.created_at).toLocaleDateString()}
        </span>
      ),
    },
  ];

  const formFields = [
    {
      name: 'name',
      label: 'Product Name',
      type: 'text' as const,
      placeholder: 'Enter product name',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea' as const,
      placeholder: 'Enter product description',
      rows: 4,
    },
    {
      name: 'price',
      label: 'Price',
      type: 'number' as const,
      placeholder: '0.00',
      required: true,
    },
    {
      name: 'stock',
      label: 'Stock Quantity',
      type: 'number' as const,
      placeholder: '0',
      required: true,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            Product Management
          </h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <Button
          onClick={handleAddNew}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockProducts}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900">{outOfStockProducts}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={products}
        columns={columns}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        actions={(product: Product) => (
          <button
            onClick={() => handleDuplicate(product)}
            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            title="Duplicate Product"
          >
            <Copy className="w-4 h-4" />
          </button>
        )}
        searchPlaceholder="Search products by name or description..."
        emptyMessage="No products found. Add your first product to get started!"
      />

      {/* Form Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
          setDuplicatingProduct(null);
        }}
        onSubmit={handleSubmit}
        title={editingProduct ? 'Edit Product' : duplicatingProduct ? 'Duplicate Product' : 'Add New Product'}
        fields={formFields}
        initialData={editingProduct ? {
          ...editingProduct,
          price: editingProduct.price.toString(),
          stock: editingProduct.stock.toString(),
        } : duplicatingProduct ? {
          name: duplicatingProduct.name,
          description: duplicatingProduct.description || '',
          price: duplicatingProduct.price.toString(),
          stock: duplicatingProduct.stock.toString(),
        } : {}}
        submitLabel={editingProduct ? 'Update Product' : 'Create Product'}
      />
    </div>
  );
}

