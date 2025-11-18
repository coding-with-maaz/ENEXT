// Client-side constants (for use in React components)

export const API_ENDPOINTS = {
  USERS: '/api/users',
  PRODUCTS: '/api/products',
  ORDERS: '/api/orders',
} as const;

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

export const PAGE_TITLES = {
  USERS: 'Users Management',
  PRODUCTS: 'Products Management',
  ORDERS: 'Orders',
  EDIT_USER: 'Edit User',
  ADD_USER: 'Add New User',
  EDIT_PRODUCT: 'Edit Product',
  ADD_PRODUCT: 'Add New Product',
} as const;

export const FORM_LABELS = {
  NAME: 'Name',
  EMAIL: 'Email',
  DESCRIPTION: 'Description',
  PRICE: 'Price',
  STOCK: 'Stock',
} as const;

export const ORDER_STATUS_COLORS = {
  completed: '#28a745',
  pending: '#ffc107',
  cancelled: '#dc3545',
} as const;

