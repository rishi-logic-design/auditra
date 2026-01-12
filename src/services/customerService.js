import api from './api';

const customerService = {
  getAllCustomers: async (params = {}) => {
    try {
      const response = await api.get('/api/customers', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getCustomerById: async (id, vendorId) => {
    try {
      const response = await api.get(`/api/customers/${id}`, {
        params: { vendorId }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createCustomer: async (customerData) => {
    try {
      const response = await api.post('/api/customers', customerData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateCustomer: async (id, customerData) => {
    try {
      const response = await api.put(`/api/customers/${id}`, customerData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteCustomer: async (id, vendorId) => {
    try {
      const response = await api.delete(`/api/customers/${id}`, {
        params: { vendorId }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getCustomerCountByVendor: async () => {
    try {
      const response = await api.get('/api/customers/count-by-vendor');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  uploadCustomerImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await api.post('/api/upload/customer-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default customerService;