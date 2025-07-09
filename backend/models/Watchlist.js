const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      default: "guest_user", // Since we're not implementing auth
    },
    movies: [
      {
        movieId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Movie",
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Ensure one watchlist per user
watchlistSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model("Watchlist", watchlistSchema);
