/**
 * Mock data for fallback when backend is unavailable
 */

export interface MockProduct {
  id: number;
  name: string;
  slug: string;
  category?: string;
  brand?: string;
  sku?: string;
  description: string;
  short_description?: string;
  price: number;
  stock: number;
  is_featured?: number;
  is_bestseller?: number;
  image_url?: string;
  tags?: string;
  meta_title?: string;
  meta_description?: string;
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
    category: 'Electronics',
    brand: 'ENEXT Pro',
    sku: 'LAP-0001',
    description: 'High-performance laptop with latest processor, 16GB RAM, and 512GB SSD. Perfect for work and gaming.',
    short_description: 'High-performance laptop with 16GB RAM and 512GB SSD.',
    price: 1299.99,
    stock: 15,
    is_featured: 1,
    is_bestseller: 1,
    tags: 'laptop,electronics,work,gaming',
    meta_title: 'Premium Laptop - High Performance Work & Gaming | ENEXT',
    meta_description: 'Shop the ENEXT Premium Laptop with the latest processor, 16GB RAM and 512GB SSD. Perfect for work, gaming and everyday use.',
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Wireless Mouse',
    slug: 'wireless-mouse',
    category: 'Accessories',
    brand: 'ENEXT Essentials',
    sku: 'ACC-0002',
    description: 'Ergonomic wireless mouse with precision tracking and long battery life. Comfortable for extended use.',
    short_description: 'Ergonomic wireless mouse with long battery life.',
    price: 29.99,
    stock: 50,
    is_featured: 1,
    tags: 'mouse,accessories,wireless,ergonomic',
    meta_title: 'Wireless Mouse - Ergonomic & Long Battery Life | ENEXT',
    meta_description: 'Discover the ENEXT Wireless Mouse with precision tracking, ergonomic design and long battery life for all-day comfort.',
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Mechanical Keyboard',
    slug: 'mechanical-keyboard',
    category: 'Accessories',
    brand: 'ENEXT Essentials',
    sku: 'ACC-0003',
    description: 'RGB backlit mechanical keyboard with Cherry MX switches. Perfect for typing and gaming.',
    short_description: 'RGB mechanical keyboard with Cherry MX switches.',
    price: 89.99,
    stock: 30,
    is_bestseller: 1,
    tags: 'keyboard,mechanical,gaming,accessories',
    meta_title: 'Mechanical Keyboard - RGB & Cherry MX Switches | ENEXT',
    meta_description: 'Type and game in style with the ENEXT Mechanical Keyboard featuring RGB lighting and Cherry MX switches.',
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: '4K Monitor',
    slug: '4k-monitor',
    category: 'Electronics',
    brand: 'ENEXT Vision',
    sku: 'MON-0004',
    description: '27-inch 4K UHD monitor with HDR support and ultra-thin bezels. Ideal for professional work.',
    short_description: '27-inch 4K UHD monitor with HDR and thin bezels.',
    price: 399.99,
    stock: 20,
    is_featured: 1,
    tags: 'monitor,4k,uhd,display,electronics',
    meta_title: '4K Monitor - 27\" UHD with HDR & Thin Bezels | ENEXT',
    meta_description: 'Upgrade your workspace with the ENEXT 27-inch 4K UHD monitor featuring HDR and ultra-thin bezels.',
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    name: 'Webcam HD',
    slug: 'webcam-hd',
    category: 'Electronics',
    brand: 'ENEXT Connect',
    sku: 'CAM-0005',
    description: '1080p HD webcam with auto-focus and built-in microphone. Perfect for video calls and streaming.',
    short_description: '1080p HD webcam with autofocus and mic.',
    price: 79.99,
    stock: 40,
    tags: 'webcam,hd,video,streaming',
    meta_title: 'HD Webcam - 1080p with Autofocus & Microphone | ENEXT',
    meta_description: 'Look and sound your best on calls with the ENEXT 1080p HD Webcam featuring autofocus and built-in microphone.',
    created_at: new Date().toISOString(),
  },
  {
    id: 6,
    name: 'Noise Cancelling Headphones',
    slug: 'noise-cancelling-headphones',
    category: 'Electronics',
    brand: 'ENEXT Audio',
    sku: 'AUD-0006',
    description: 'Premium wireless headphones with active noise cancellation and 30-hour battery life.',
    short_description: 'Wireless ANC headphones with 30-hour battery.',
    price: 249.99,
    stock: 25,
    is_featured: 1,
    is_bestseller: 1,
    tags: 'headphones,wireless,anc,audio',
    meta_title: 'Noise Cancelling Headphones - Wireless ANC | ENEXT',
    meta_description: 'Immerse yourself in sound with ENEXT Noise Cancelling Headphones featuring wireless ANC and 30-hour battery life.',
    created_at: new Date().toISOString(),
  },
  {
    id: 7,
    name: 'USB-C Hub',
    slug: 'usb-c-hub',
    category: 'Accessories',
    brand: 'ENEXT Connect',
    sku: 'ACC-0007',
    description: 'Multi-port USB-C hub with HDMI, USB 3.0, and SD card reader. Expand your connectivity.',
    short_description: 'Multi-port USB-C hub for expanded connectivity.',
    price: 49.99,
    stock: 60,
    tags: 'usb-c,hub,accessories,connectivity',
    meta_title: 'USB-C Hub - Multi-port with HDMI & USB 3.0 | ENEXT',
    meta_description: 'Expand your laptop connectivity with the ENEXT USB-C Hub featuring HDMI, USB 3.0 and SD card reader.',
    created_at: new Date().toISOString(),
  },
  {
    id: 8,
    name: 'SSD External Drive',
    slug: 'ssd-external-drive',
    category: 'Electronics',
    brand: 'ENEXT Storage',
    sku: 'STO-0008',
    description: '1TB portable SSD with USB 3.2 Gen 2. Fast data transfer speeds up to 1050MB/s.',
    short_description: '1TB portable SSD with ultra-fast transfers.',
    price: 119.99,
    stock: 35,
    tags: 'ssd,storage,external,portable',
    meta_title: '1TB SSD External Drive - USB 3.2 Gen 2 | ENEXT',
    meta_description: 'Store and transfer files quickly with the ENEXT 1TB portable SSD featuring USB 3.2 Gen 2 and speeds up to 1050MB/s.',
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

