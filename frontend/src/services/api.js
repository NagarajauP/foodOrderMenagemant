import axios from 'axios';

const STORAGE_KEY = 'food_order_api_base_url';
export const DEFAULT_API_BASE_URL = 'http://localhost:2131';

export const getApiBaseUrl = () => {
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_API_BASE_URL;
};

export const setApiBaseUrl = (url) => {
  const cleanUrl = url.trim().replace(/\/+$/, '');
  localStorage.setItem(STORAGE_KEY, cleanUrl);
  apiClient.defaults.baseURL = cleanUrl;
  return cleanUrl;
};

export const resetApiBaseUrl = () => {
  localStorage.removeItem(STORAGE_KEY);
  apiClient.defaults.baseURL = DEFAULT_API_BASE_URL;
  return DEFAULT_API_BASE_URL;
};

const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const api = {
  // Health check / welcome message
  async checkHealth() {
    const res = await apiClient.get('/foodorder/wel');
    return res.data;
  },

  // Fetch all orders
  async getAllOrders() {
    const res = await apiClient.get('/foodorder/getorders');
    return res.data;
  },

  // Fetch single order by ID
  async getOrderById(orderId) {
    const res = await apiClient.get(`/foodorder/getOrder/${orderId}`);
    return res.data;
  },

  // Create new order
  async createOrder(orderPayload) {
    const res = await apiClient.post('/foodorder/create', orderPayload);
    return res.data;
  },

  // Update existing order
  async updateOrder(orderId, orderPayload) {
    const res = await apiClient.put(`/foodorder/update/${orderId}`, orderPayload);
    return res.data;
  },

  // Delete order
  async deleteOrder(orderId) {
    const res = await apiClient.delete(`/foodorder/delete/${orderId}`);
    return res.data;
  },

  // Filter orders by email
  async getOrdersByEmail(email) {
    const res = await apiClient.get(`/foodorder/getorders/email/${encodeURIComponent(email)}`);
    return res.data;
  },

  // Filter orders by status
  async getOrdersByStatus(status) {
    const res = await apiClient.get(`/foodorder/getorders/status/${encodeURIComponent(status)}`);
    return res.data;
  },
};

export default api;
