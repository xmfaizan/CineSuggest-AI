const express = require("express");
const router = express.Router();
const { upload, handleUploadError } = require("../middleware/upload");
const {
  getRecommendations,
  getMovieDetails,
  getPopularMovies,
  getGenres,
} = require("../controllers/movieController");

// @route   POST /api/movies/recommend
// @desc    Get AI-powered movie recommendations
// @access  Public
router.post("/recommend", upload, handleUploadError, getRecommendations);

// @route   GET /api/movies/popular
// @desc    Get popular movies
// @access  Public
router.get("/popular", getPopularMovies);

// @route   GET /api/movies/genres
// @desc    Get movie genres
// @access  Public
router.get("/genres", getGenres);

// @route   GET /api/movies/:id
// @desc    Get movie details
// @access  Public
router.get("/:id", getMovieDetails);

module.exports = router;
