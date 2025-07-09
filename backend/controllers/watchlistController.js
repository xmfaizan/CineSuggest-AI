const Watchlist = require("../models/Watchlist");
const Movie = require("../models/Movie");

const USER_ID = "guest_user"; // Fixed user ID since no auth

// @desc    Get user's watchlist
// @route   GET /api/watchlist
// @access  Public
const getWatchlist = async (req, res) => {
  try {
    const watchlist = await Watchlist.findOne({ userId: USER_ID })
      .populate("movies.movieId")
      .sort({ "movies.addedAt": -1 });

    if (!watchlist) {
      return res.json({
        success: true,
        data: {
          movies: [],
          totalCount: 0,
        },
      });
    }

    res.json({
      success: true,
      data: {
        movies: watchlist.movies.map((item) => ({
          ...item.movieId.toObject(),
          addedAt: item.addedAt,
        })),
        totalCount: watchlist.movies.length,
      },
    });
  } catch (error) {
    console.error("Get watchlist error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get watchlist",
    });
  }
};

// @desc    Add movie to watchlist
// @route   POST /api/watchlist
// @access  Public
const addToWatchlist = async (req, res) => {
  try {
    const { movieId } = req.body;

    if (!movieId) {
      return res.status(400).json({
        success: false,
        error: "Movie ID is required",
      });
    }

    // Check if movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        success: false,
        error: "Movie not found",
      });
    }

    // Get or create watchlist
    let watchlist = await Watchlist.findOne({ userId: USER_ID });

    if (!watchlist) {
      watchlist = new Watchlist({
        userId: USER_ID,
        movies: [],
      });
    }

    // Check if movie is already in watchlist
    const existingMovie = watchlist.movies.find(
      (item) => item.movieId.toString() === movieId
    );

    if (existingMovie) {
      return res.status(400).json({
        success: false,
        error: "Movie is already in watchlist",
      });
    }

    // Add movie to watchlist
    watchlist.movies.push({
      movieId: movieId,
      addedAt: new Date(),
    });

    await watchlist.save();

    res.json({
      success: true,
      message: "Movie added to watchlist",
      data: {
        movie: movie,
        addedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Add to watchlist error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to add movie to watchlist",
    });
  }
};

// @desc    Remove movie from watchlist
// @route   DELETE /api/watchlist/:movieId
// @access  Public
const removeFromWatchlist = async (req, res) => {
  try {
    const { movieId } = req.params;

    const watchlist = await Watchlist.findOne({ userId: USER_ID });

    if (!watchlist) {
      return res.status(404).json({
        success: false,
        error: "Watchlist not found",
      });
    }

    // Remove movie from watchlist
    const initialLength = watchlist.movies.length;
    watchlist.movies = watchlist.movies.filter(
      (item) => item.movieId.toString() !== movieId
    );

    if (watchlist.movies.length === initialLength) {
      return res.status(404).json({
        success: false,
        error: "Movie not found in watchlist",
      });
    }

    await watchlist.save();

    res.json({
      success: true,
      message: "Movie removed from watchlist",
    });
  } catch (error) {
    console.error("Remove from watchlist error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to remove movie from watchlist",
    });
  }
};

// @desc    Check if movie is in watchlist
// @route   GET /api/watchlist/check/:movieId
// @access  Public
const checkInWatchlist = async (req, res) => {
  try {
    const { movieId } = req.params;

    const watchlist = await Watchlist.findOne({ userId: USER_ID });

    if (!watchlist) {
      return res.json({
        success: true,
        data: { inWatchlist: false },
      });
    }

    const inWatchlist = watchlist.movies.some(
      (item) => item.movieId.toString() === movieId
    );

    res.json({
      success: true,
      data: { inWatchlist },
    });
  } catch (error) {
    console.error("Check watchlist error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to check watchlist",
    });
  }
};

module.exports = {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  checkInWatchlist,
};
