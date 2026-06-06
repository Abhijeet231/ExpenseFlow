import api from "./api.js";

// POST /api/expenses
// data: { date, category, amount, description, status, receipt? }
export const createExpense = async (data) => {
  const formData = new FormData();

  formData.append("date", data.date);
  formData.append("category", data.category);
  formData.append("amount", data.amount);
  formData.append("description", data.description);

  if (data.status) {
    formData.append("status", data.status);
  }

  if (data.receipt) {
    formData.append("receipt", data.receipt); // must match upload.single("receipt")
  }

  const response = await api.post("/api/expenses", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

// GET /api/expenses/my
// filters: { status?, category?, search? }
export const getMyExpenses = async (filters = {}) => {
  const response = await api.get("/api/expenses/my", { params: filters });
  return response.data;
};

// GET /api/expenses/:expenseId
export const getExpenseById = async (expenseId) => {
  const response = await api.get(`/api/expenses/${expenseId}`);
  return response.data;
};

// PATCH /api/expenses/:expenseId
// data: { date?, category?, amount?, description?, receipt? }
export const updateExpense = async (expenseId, data) => {
  const formData = new FormData();

  if (data.date) formData.append("date", data.date);
  if (data.category) formData.append("category", data.category);
  if (data.amount !== undefined) formData.append("amount", data.amount);
  if (data.description) formData.append("description", data.description);
  if (data.receipt) formData.append("receipt", data.receipt);

  const response = await api.patch(`/api/expenses/${expenseId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

// DELETE /api/expenses/:expenseId
export const deleteExpense = async (expenseId) => {
  const response = await api.delete(`/api/expenses/${expenseId}`);
  return response.data;
};