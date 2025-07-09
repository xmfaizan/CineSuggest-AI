const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    tmdbId: {
      type: Number,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    overview: {
      type: String,
      required: true,
    },
    posterPath: {
      type: String,
    },
    backdropPath: {
      type: String,
    },
    releaseDate: {
      type: String,
    },
    voteAverage: {
      type: Number,
    },
    voteCount: {
      type: Number,
    },
    genres: [
      {
        id: Number,
        name: String,
      },
    ],
    runtime: {
      type: Number,
    },
    originalLanguage: {
      type: String,
    },
    popularity: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better search performance
movieSchema.index({ title: "text", overview: "text" });

module.exports = mongoose.model("Movie", movieSchema);
