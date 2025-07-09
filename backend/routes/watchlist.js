const express = require("express");
const router = express.Router();
const {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  checkInWatchlist,
} = require("../controllers/watchlistController");

// @route   GET /api/watchlist
// @desc    Get user's watchlist
// @access  Public
router.get("/", getWatchlist);

// @route   POST /api/watchlist
// @desc    Add movie to watchlist
// @access  Public
router.post("/", addToWatchlist);

// @route   DELETE /api/watchlist/:movieId
// @desc    Remove movie from watchlist
// @access  Public
router.delete("/:movieId", removeFromWatchlist);

// @route   GET /api/watchlist/check/:movieId
// @desc    Check if movie is in watchlist
// @access  Public
router.get("/check/:movieId", checkInWatchlist);

module.exports = router;
