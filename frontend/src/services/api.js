import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

export const medicineApi = {
  getAll: (search = '') =>
    api.get(`/medicines/?search=${search}`),
  getOne: (id) =>
    api.get(`/medicines/${id}/`),
  create: (data) =>
    api.post('/medicines/', data),
  update: (id, data) =>
    api.put(`/medicines/${id}/`, data),
  delete: (id) =>
    api.delete(`/medicines/${id}/`),
  adjustStock: (id, data) =>
    api.post(`/medicines/${id}/adjust_stock/`, data),
  getDashboardStats: () =>
    api.get('/medicines/dashboard_stats/'),
  getLowStock: () =>
    api.get('/medicines/low_stock/'),
}

export const supplierApi = {
  getAll: () => api.get('/suppliers/'),
  create: (data) => api.post('/suppliers/', data),
  update: (id, data) => api.put(`/suppliers/${id}/`, data),
  delete: (id) => api.delete(`/suppliers/${id}/`),
}

export const categoryApi = {
  getAll: () => api.get('/categories/'),
  create: (data) => api.post('/categories/', data),
}

export const transactionApi = {
  getAll: () => api.get('/transactions/'),
}

export default api
