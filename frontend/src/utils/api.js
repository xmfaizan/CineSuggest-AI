import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  timeout: 30000, // 30 seconds timeout for AI processing
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(
      `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("❌ API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(
      `✅ API Response: ${response.config.method?.toUpperCase()} ${
        response.config.url
      }`
    );
    return response;
  },
  (error) => {
    console.error("❌ API Response Error:", error);

    // Handle different error types
    if (error.code === "ECONNABORTED") {
      error.message = "Request timeout. The server took too long to respond.";
    } else if (error.response) {
      // Server responded with error status
      error.message =
        error.response.data?.error ||
        error.response.data?.message ||
        error.message;
    } else if (error.request) {
      // Request was made but no response received
      error.message =
        "No response from server. Please check if the server is running.";
    }

    return Promise.reject(error);
  }
);

// Movie API functions
export const movieAPI = {
  // Get movie recommendations
  getRecommendations: async (formData) => {
    const response = await api.post("/movies/recommend", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Get movie details
  getMovieDetails: async (movieId) => {
    const response = await api.get(`/movies/${movieId}`);
    return response.data;
  },

  // Get popular movies
  getPopularMovies: async (page = 1) => {
    const response = await api.get(`/movies/popular?page=${page}`);
    return response.data;
  },

  // Get genres
  getGenres: async () => {
    const response = await api.get("/movies/genres");
    return response.data;
  },
};

// Watchlist API functions
export const watchlistAPI = {
  // Get watchlist
  getWatchlist: async () => {
    const response = await api.get("/watchlist");
    return response.data;
  },

  // Add to watchlist
  addToWatchlist: async (movieId) => {
    const response = await api.post("/watchlist", { movieId });
    return response.data;
  },

  // Remove from watchlist
  removeFromWatchlist: async (movieId) => {
    const response = await api.delete(`/watchlist/${movieId}`);
    return response.data;
  },

  // Check if movie is in watchlist
  checkInWatchlist: async (movieId) => {
    const response = await api.get(`/watchlist/check/${movieId}`);
    return response.data;
  },
};

// Test API functions
export const testAPI = {
  // Test AI functionality
  testAI: async (formData) => {
    const response = await api.post("/test/ai", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Check AI status
  getAIStatus: async () => {
    const response = await api.get("/test/ai-status");
    return response.data;
  },
};

// Health check
export const healthCheck = async () => {
  const response = await api.get("/health");
  return response.data;
};

export default api;
