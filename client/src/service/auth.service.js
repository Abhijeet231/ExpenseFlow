import api from "./api.js";

// POST /api/auth/register
export const registerUser = async (data) => {
  const response = await api.post("/api/auth/register", data);
  return response.data;
};

// POST /api/auth/login
export const loginUser = async (data) => {
  const response = await api.post("/api/auth/login", data);
  return response.data;
};

// POST /api/auth/logout
export const logoutUser = async () => {
  const response = await api.post("/api/auth/logout");
  return response.data;
};

// GET /api/auth/me
export const getMe = async () => {
  const response = await api.get("/api/auth/me");
  return response.data;
};