/**
 * Mock data for fallback when backend is unavailable
 */

export interface MockProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  created_at: string;
}

export interface MockUser {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface MockOrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
}

export interface MockOrder {
  id: number;
  user_id: number;
  total: number;
  status: string;
  created_at: string;
  user_name?: string;
  user_email?: string;
  items: MockOrderItem[];
}

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: 1,
    name: 'Premium Laptop',
    slug: 'premium-laptop',
    description: 'High-performance laptop with latest processor, 16GB RAM, and 512GB SSD. Perfect for work and gaming.',
    price: 1299.99,
    stock: 15,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Wireless Mouse',
    slug: 'wireless-mouse',
    description: 'Ergonomic wireless mouse with precision tracking and long battery life. Comfortable for extended use.',
    price: 29.99,
    stock: 50,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Mechanical Keyboard',
    slug: 'mechanical-keyboard',
    description: 'RGB backlit mechanical keyboard with Cherry MX switches. Perfect for typing and gaming.',
    price: 89.99,
    stock: 30,
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: '4K Monitor',
    slug: '4k-monitor',
    description: '27-inch 4K UHD monitor with HDR support and ultra-thin bezels. Ideal for professional work.',
    price: 399.99,
    stock: 20,
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    name: 'Webcam HD',
    slug: 'webcam-hd',
    description: '1080p HD webcam with auto-focus and built-in microphone. Perfect for video calls and streaming.',
    price: 79.99,
    stock: 40,
    created_at: new Date().toISOString(),
  },
  {
    id: 6,
    name: 'Noise Cancelling Headphones',
    slug: 'noise-cancelling-headphones',
    description: 'Premium wireless headphones with active noise cancellation and 30-hour battery life.',
    price: 249.99,
    stock: 25,
    created_at: new Date().toISOString(),
  },
  {
    id: 7,
    name: 'USB-C Hub',
    slug: 'usb-c-hub',
    description: 'Multi-port USB-C hub with HDMI, USB 3.0, and SD card reader. Expand your connectivity.',
    price: 49.99,
    stock: 60,
    created_at: new Date().toISOString(),
  },
  {
    id: 8,
    name: 'SSD External Drive',
    slug: 'ssd-external-drive',
    description: '1TB portable SSD with USB 3.2 Gen 2. Fast data transfer speeds up to 1050MB/s.',
    price: 119.99,
    stock: 35,
    created_at: new Date().toISOString(),
  },
];

export const MOCK_USERS: MockUser[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    created_at: new Date().toISOString(),
  },
];

export const MOCK_ORDERS: MockOrder[] = [
  {
    id: 1,
    user_id: 1,
    total: 1299.99,
    status: 'completed',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    user_name: 'John Doe',
    user_email: 'john.doe@example.com',
    items: [
      { id: 1, product_id: 1, product_name: 'Premium Laptop', quantity: 1, price: 1299.99 },
    ],
  },
  {
    id: 2,
    user_id: 2,
    total: 119.98,
    status: 'pending',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    user_name: 'Jane Smith',
    user_email: 'jane.smith@example.com',
    items: [
      { id: 2, product_id: 2, product_name: 'Wireless Mouse', quantity: 2, price: 29.99 },
      { id: 3, product_id: 3, product_name: 'Mechanical Keyboard', quantity: 1, price: 89.99 },
    ],
  },
  {
    id: 3,
    user_id: 1,
    total: 399.99,
    status: 'completed',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    user_name: 'John Doe',
    user_email: 'john.doe@example.com',
    items: [
      { id: 4, product_id: 4, product_name: '4K Monitor', quantity: 1, price: 399.99 },
    ],
  },
];

/**
 * Get mock products (useful for fallback)
 */
export function getMockProducts(): MockProduct[] {
  return MOCK_PRODUCTS;
}

/**
 * Get mock users (useful for fallback)
 */
export function getMockUsers(): MockUser[] {
  return MOCK_USERS;
}

/**
 * Get mock orders (useful for fallback)
 */
export function getMockOrders(): MockOrder[] {
  return MOCK_ORDERS;
}

/**
 * Get a single mock product by ID or slug
 */
export function getMockProduct(identifier: string | number): MockProduct | null {
  const products = MOCK_PRODUCTS;
  if (typeof identifier === 'number') {
    return products.find(p => p.id === identifier) || null;
  }
  return products.find(p => p.slug === identifier) || null;
}

