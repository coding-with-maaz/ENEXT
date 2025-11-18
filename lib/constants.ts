// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// API Response Messages
export const API_MESSAGES = {
  SUCCESS: 'Operation completed successfully',
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  PRODUCT_CREATED: 'Product created successfully',
  PRODUCT_UPDATED: 'Product updated successfully',
  PRODUCT_DELETED: 'Product deleted successfully',
  ORDER_CREATED: 'Order created successfully',
  NOT_FOUND: {
    USER: 'User not found',
    PRODUCT: 'Product not found',
    ORDER: 'Order not found',
  },
  VALIDATION_ERROR: {
    NAME_REQUIRED: 'Name is required',
    EMAIL_REQUIRED: 'Email is required',
    PRICE_REQUIRED: 'Price is required',
    USER_ID_REQUIRED: 'User ID is required',
    ITEMS_REQUIRED: 'Items are required',
    INVALID_EMAIL: 'Invalid email format',
  },
} as const;

// Database Table Names
export const TABLES = {
  USERS: 'users',
  PRODUCTS: 'products',
  ORDERS: 'orders',
  ORDER_ITEMS: 'order_items',
} as const;

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  USERS: '/api/users',
  PRODUCTS: '/api/products',
  ORDERS: '/api/orders',
} as const;

// Database Connection Defaults
export const DB_DEFAULTS = {
  HOST: 'localhost',
  USER: 'root',
  PASSWORD: '',
  DATABASE: 'enext_db',
  CONNECTION_LIMIT: 10,
  QUEUE_LIMIT: 0,
} as const;

// UI Messages
export const UI_MESSAGES = {
  LOADING: 'Loading...',
  NO_DATA: {
    USERS: 'No users found. Create one to get started!',
    PRODUCTS: 'No products found. Create one to get started!',
    ORDERS: 'No orders found. Create users and products first, then orders can be created via API.',
  },
  CONFIRM_DELETE: {
    USER: 'Are you sure you want to delete this user?',
    PRODUCT: 'Are you sure you want to delete this product?',
  },
  ERRORS: {
    FETCH: 'Error fetching data',
    SAVE: 'Error saving data',
    DELETE: 'Error deleting data',
  },
} as const;

// Form Labels
export const FORM_LABELS = {
  NAME: 'Name',
  EMAIL: 'Email',
  DESCRIPTION: 'Description',
  PRICE: 'Price',
  STOCK: 'Stock',
} as const;

// Button Labels
export const BUTTON_LABELS = {
  ADD_USER: '+ Add User',
  ADD_PRODUCT: '+ Add Product',
  CANCEL: 'Cancel',
  EDIT: 'Edit',
  DELETE: 'Delete',
  UPDATE_USER: 'Update User',
  CREATE_USER: 'Create User',
  UPDATE_PRODUCT: 'Update Product',
  CREATE_PRODUCT: 'Create Product',
  BACK_HOME: '← Back to Home',
} as const;

// Page Titles
export const PAGE_TITLES = {
  USERS: 'Users Management',
  PRODUCTS: 'Products Management',
  ORDERS: 'Orders',
  EDIT_USER: 'Edit User',
  ADD_USER: 'Add New User',
  EDIT_PRODUCT: 'Edit Product',
  ADD_PRODUCT: 'Add New Product',
} as const;

