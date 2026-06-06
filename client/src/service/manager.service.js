import api from "./api.js";

// GET /api/manager/pending
export const getPendingExpenses = async () => {
  const response = await api.get("/api/manager/pending");
  return response.data;
};

// PATCH /api/manager/:expenseId/status
// status: "approved" | "rejected"
export const updateExpenseStatus = async (expenseId, status) => {
  const response = await api.patch(`/api/manager/${expenseId}/status`, { status });
  return response.data;
};

// GET /api/manager/history
// filters: { status?, user?, search? }
export const getExpenseHistory = async (filters = {}) => {
  const response = await api.get("/api/manager/history", { params: filters });
  return response.data;
};