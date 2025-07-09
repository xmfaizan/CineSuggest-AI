const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config();

// Check required environment variables
if (
  !process.env.TMDB_API_KEY ||
  process.env.TMDB_API_KEY === "your_tmdb_api_key_here"
) {
  console.error("❌ TMDB_API_KEY not configured in .env file");
  console.log(
    "💡 Get your API key from: https://www.themoviedb.org/settings/api"
  );
  console.log("📝 Then update the TMDB_API_KEY in your .env file");
  process.exit(1);
}

if (
  !process.env.HUGGINGFACE_API_TOKEN ||
  process.env.HUGGINGFACE_API_TOKEN === "your_huggingface_token_here"
) {
  console.warn(
    "⚠️ HUGGINGFACE_API_TOKEN not configured - image analysis will use fallback mode"
  );
  console.log("💡 Get your token from: https://huggingface.co/settings/tokens");
  console.log("📝 Then update the HUGGINGFACE_API_TOKEN in your .env file");
} else {
  console.log("✅ Hugging Face API token configured");
}

// Import modules
const connectDB = require("./config/database");
const errorHandler = require("./middleware/errorHandler");

// Route files
const movieRoutes = require("./routes/movies");
const watchlistRoutes = require("./routes/watchlist");
const testRoutes = require("./routes/test");

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// CORS middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://your-domain.com"]
        : ["http://localhost:3000"],
    credentials: true,
  })
);

// Static files middleware (for uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
  next();
});

// Routes
app.use("/api/movies", movieRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/test", testRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Welcome route
app.get("/", (req, res) => {
  res.json({
    message: "AI Movie Recommendation API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      movies: "/api/movies",
      watchlist: "/api/watchlist",
    },
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// Error handler middleware (should be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}
📊 API Health Check: http://localhost:${PORT}/api/health
📚 API Documentation: http://localhost:${PORT}/
  `);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down due to uncaught exception");
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});

module.exports = app;
