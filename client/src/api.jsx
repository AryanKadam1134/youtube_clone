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

  // All Current User Videos
  getAllMyVideos: (params) => api.get(`${BASE_URL}/videos/me/all`, { params }),

  // All Current User Videos
  updateVideoDetails: (videoId, body) =>
    api.patch(`${BASE_URL}/videos/${videoId}/update_video`, body),

  // Single Video
  singleVideo: (videoId) => api.get(`${BASE_URL}/videos/${videoId}/single`),

  // Like Video
  likeVideo: (videoId) =>
    api.post(`${BASE_URL}/reactions/video/${videoId}/like`),

  // Dislike Video
  dislikeVideo: (videoId) =>
    api.post(`${BASE_URL}/reactions/video/${videoId}/dislike`),

  // Add Comment
  addComment: (videoId, body) =>
    api.post(`${BASE_URL}/comments/${videoId}/add`, body),

  // Delete Comment
  deleteComment: (commentId) =>
    api.delete(`${BASE_URL}/comments/${commentId}/delete`),

  // Add Comment
  allComments: (videoId) => api.get(`${BASE_URL}/comments/${videoId}/all`),
};
