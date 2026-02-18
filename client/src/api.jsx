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
  register: (data) => api.post(`/users/register`, data),

  // Login
  login: (body) => api.post(`/users/login`, body),

  // Logout
  logout: () => api.post(`/users/logout`),

  // Login
  getWatchHistory: () => api.get(`/users/me/watch-history`),

  // All Videos
  getAllVideos: () => api.get(`/videos/all`),

  // All Current User Videos
  getAllMyVideos: (params) => api.get(`/videos/me/all`, { params }),

  // User Details
  getUserChannelDetails: (userId) => api.get(`/users/${userId}/channel`),

  // User Channel Details
  getUserChannelVideos: (userId) => api.get(`/videos/${userId}`),

  // All Current User Videos
  updateVideoDetails: (videoId, body) =>
    api.patch(`/videos/${videoId}/update_video`, body),

  // Single Video
  singleVideo: (videoId) => api.get(`/videos/${videoId}/single`),

  // Like Video
  likeVideo: (videoId) => api.post(`/reactions/video/${videoId}/like`),

  // Dislike Video
  dislikeVideo: (videoId) => api.post(`/reactions/video/${videoId}/dislike`),

  // Add Comment
  addComment: (videoId, body) => api.post(`/comments/${videoId}/add`, body),

  // Delete Comment
  deleteComment: (commentId) => api.delete(`/comments/${commentId}/delete`),

  // Add Comment
  allComments: (videoId) => api.get(`/comments/${videoId}/all`),

  // View Video
  viewVideo: (videoId) => api.patch(`/view_videos/${videoId}`),

  // View Video
  likeComment: (commentId) => api.post(`/reactions/comment/${commentId}/like`),

  // View Video
  dislikeComment: (commentId) =>
    api.post(`/reactions/comment/${commentId}/dislike`),
};
