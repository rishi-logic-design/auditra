import api from "./api";

const subscriptionService = {
  getPlans: async () => {
    try {
      const response = await api.get("/subscriptions/plans");
      return response.data;
    } catch (error) {
      console.error("Error fetching plans:", error);
      throw error.response?.data || error;
    }
  },

  createPlan: async (planData) => {
    try {
      const response = await api.post("/subscriptions/plans", planData);
      return response.data;
    } catch (error) {
      console.error("Error creating plan:", error);
      throw error.response?.data || error;
    }
  },

  updatePlan: async (id, planData) => {
    try {
      const response = await api.put(`/subscriptions/plans/${id}`, planData);
      return response.data;
    } catch (error) {
      console.error("Error updating plan:", error);
      throw error.response?.data || error;
    }
  },

  deletePlan: async (id) => {
    try {
      const response = await api.delete(`/subscriptions/plans/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting plan:", error);
      throw error.response?.data || error;
    }
  },

  assignSubscription: async (data) => {
    try {
      const response = await api.post("/subscriptions/assign", data);
      return response.data;
    } catch (error) {
      console.error("Error assigning subscription:", error);
      throw error.response?.data || error;
    }
  },

  getSubscriptions: async (params = {}) => {
    try {
      const response = await api.get("/subscriptions", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      throw error.response?.data || error;
    }
  },

  getSubscriptionById: async (id) => {
    try {
      const response = await api.get(`/subscriptions/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching subscription:", error);
      throw error.response?.data || error;
    }
  },

  updateSubscription: async (id, data) => {
    try {
      const response = await api.put(`/subscriptions/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating subscription:", error);
      throw error.response?.data || error;
    }
  },

  cancelSubscription: async (id) => {
    try {
      const response = await api.post(`/subscriptions/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      throw error.response?.data || error;
    }
  },

  renewSubscription: async (id, planId = null) => {
    try {
      const response = await api.post(`/subscriptions/${id}/renew`, { planId });
      return response.data;
    } catch (error) {
      console.error("Error renewing subscription:", error);
      throw error.response?.data || error;
    }
  },

  getStats: async () => {
    try {
      const response = await api.get("/subscriptions/stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching stats:", error);
      throw error.response?.data || error;
    }
  },

  getExpiringSubscriptions: async (days = 7) => {
    try {
      const response = await api.get("/subscriptions/expiring", {
        params: { days },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching expiring subscriptions:", error);
      throw error.response?.data || error;
    }
  },

  getExpiredToday: async () => {
    try {
      const response = await api.get("/subscriptions/expired-today");
      return response.data;
    } catch (error) {
      console.error("Error fetching expired subscriptions:", error);
      throw error.response?.data || error;
    }
  },

  calculateDaysLeft: (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const diffTime = end - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  formatDate: (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  },

  getStatusClass: (status) => {
    const statusMap = {
      active: "status-active",
      expired: "status-expired",
      cancelled: "status-cancelled",
      Active: "status-active",
      Inactive: "status-inactive",
    };
    return statusMap[status] || "";
  },
};

export default subscriptionService;
