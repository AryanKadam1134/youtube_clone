import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Create axios instance with base configuration matching Angular's setup
const api = axios.create({
  baseURL: BASE_URL, // Use relative paths with proxy
  timeout: 10000,
  withCredentials: true,
  // headers: {
  //   "Content-Type": "application/json",
  //   Accept: "application/json",
  // },
});

export const apiEndpoints = {
  // Register
  register: (data) => api.post(`${BASE_URL}/users/register`, data),

  // Login
  login: (body) => api.post(`${BASE_URL}/users/login`, body),

  // All Videos
  getAllVideos: () => api.get(`${BASE_URL}/videos/all`),

  // All Videos
  getAllMyVideos: (params) => api.get(`${BASE_URL}/videos/me/all`, { params }),
};
