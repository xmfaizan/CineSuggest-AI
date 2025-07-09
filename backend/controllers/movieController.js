const Movie = require("../models/Movie");
const tmdbService = require("../services/tmdbService");
const fs = require("fs");

// Use Hugging Face AI service
const aiService = require("../services/huggingfaceAiService");

// @desc    Get movie recommendations based on AI analysis
// @route   POST /api/movies/recommend
// @access  Public
const getRecommendations = async (req, res) => {
  try {
    const { text, mood } = req.body;
    const imagePath = req.file?.path;

    // Validate input - at least one input should be provided
    if (!text && !imagePath && !mood) {
      return res.status(400).json({
        success: false,
        error: "At least one input (image, text, or mood) is required",
      });
    }

    let imageDescription = "";

    // Process image with ViT if provided
    if (imagePath) {
      try {
        console.log("🔍 Processing image with ViT model...");
        imageDescription = await aiService.processImage(imagePath);

        if (imageDescription) {
          console.log("🤖 ViT analysis completed successfully");
        } else {
          console.log(
            "⚠️ ViT analysis failed, continuing without image analysis"
          );
          imageDescription = "No image analysis available";
        }

        // Clean up uploaded file safely with delay
        setTimeout(() => {
          try {
            if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
            }
          } catch (cleanupError) {
            console.log(
              "Note: Could not clean up uploaded file, but processing continued successfully"
            );
          }
        }, 2000);
      } catch (error) {
        console.error("Image processing failed:", error);

        // Clean up uploaded file on error (with delay)
        setTimeout(() => {
          try {
            if (imagePath && fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
            }
          } catch (cleanupError) {
            console.log("Note: Could not clean up uploaded file");
          }
        }, 2000);

        // Continue without image analysis
        imageDescription = "Image analysis unavailable";
      }
    }

    // Generate specific movie recommendations using AI
    console.log("🤖 Generating AI movie recommendations...");
    const movieTitles = await aiService.generateMovieRecommendations(
      imageDescription,
      text,
      mood
    );
    console.log("🎬 AI recommended movies:", movieTitles);

    // Search for each specific movie title on TMDB
    const movieResults = [];
    const searchPromises = movieTitles.map(async (title) => {
      try {
        console.log(`🔍 Searching TMDB for: "${title}"`);
        const tmdbResult = await tmdbService.searchMovies(title);
        if (tmdbResult.results && tmdbResult.results.length > 0) {
          // Take the first (most relevant) result for each title
          const movie = tmdbResult.results[0];
          console.log(
            `✅ Found: ${movie.title} (${
              movie.release_date?.split("-")[0] || "Unknown"
            })`
          );
          return movie;
        } else {
          console.log(`❌ No results found for: "${title}"`);
          return null;
        }
      } catch (error) {
        console.error(`❌ Search failed for "${title}":`, error.message);
        return null;
      }
    });

    // Wait for all searches to complete
    const searchResults = await Promise.all(searchPromises);
    const validResults = searchResults.filter((movie) => movie !== null);

    console.log(
      `🎭 Successfully found ${validResults.length} out of ${movieTitles.length} recommended movies`
    );

    // If we didn't find enough movies, add some popular fallbacks
    if (validResults.length < 5) {
      console.log("🔄 Adding popular movies to reach minimum count...");
      try {
        const fallbackResult = await tmdbService.getPopularMovies();
        const needed = 10 - validResults.length;
        const fallbackMovies = fallbackResult.results.slice(0, needed);
        validResults.push(...fallbackMovies);
      } catch (error) {
        console.error("❌ Could not get fallback movies:", error.message);
      }
    }

    movieResults.push(...validResults);

    // Remove duplicates and get top 10
    const uniqueMovies = movieResults
      .filter(
        (movie, index, self) =>
          index === self.findIndex((m) => m.id === movie.id)
      )
      .slice(0, 10);

    // Save movies to database
    const savedMovies = await Promise.all(
      uniqueMovies.map(async (movie) => {
        try {
          const existingMovie = await Movie.findOne({ tmdbId: movie.id });
          if (existingMovie) {
            return existingMovie;
          }

          const newMovie = new Movie({
            tmdbId: movie.id,
            title: movie.title,
            overview: movie.overview,
            posterPath: movie.poster_path,
            backdropPath: movie.backdrop_path,
            releaseDate: movie.release_date,
            voteAverage: movie.vote_average,
            voteCount: movie.vote_count,
            originalLanguage: movie.original_language,
            popularity: movie.popularity,
            genres: movie.genre_ids?.map((id) => ({ id })) || [],
          });

          return await newMovie.save();
        } catch (error) {
          console.error("Error saving movie:", error);
          return null;
        }
      })
    );

    const validMovies = savedMovies.filter((movie) => movie !== null);

    // Log final results
    console.log(
      `🎬 Final results: ${validMovies.length} movies saved to database`
    );

    if (validMovies.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          movies: [],
          aiAnalysis: {
            imageDescription,
            recommendedTitles: movieTitles,
            foundMovies: 0,
            totalRecommended: movieTitles.length,
            query: `AI recommended ${movieTitles.length} movies but none were found in database`,
          },
          totalResults: 0,
          message:
            "No movies found. This might be due to network issues with movie database. Please try again.",
        },
      });
    }

    res.json({
      success: true,
      data: {
        movies: validMovies,
        aiAnalysis: {
          imageDescription,
          recommendedTitles: movieTitles,
          foundMovies: validMovies.length,
          totalRecommended: movieTitles.length,
          query: `AI recommended ${movieTitles.length} movies based on your inputs`,
        },
        totalResults: validMovies.length,
      },
    });
  } catch (error) {
    console.error("Recommendation error:", error);

    // Clean up uploaded file if error occurs (with delay and error handling)
    if (req.file?.path) {
      setTimeout(() => {
        try {
          if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }
        } catch (cleanupError) {
          console.log("Note: Could not clean up uploaded file after error");
        }
      }, 2000);
    }

    res.status(500).json({
      success: false,
      error: "Failed to generate recommendations",
    });
  }
};

// @desc    Get movie details
// @route   GET /api/movies/:id
// @access  Public
const getMovieDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // First check our database
    let movie = await Movie.findOne({ tmdbId: id });

    if (!movie) {
      // If not found, fetch from TMDB
      const tmdbMovie = await tmdbService.getMovieDetails(id);

      movie = new Movie({
        tmdbId: tmdbMovie.id,
        title: tmdbMovie.title,
        overview: tmdbMovie.overview,
        posterPath: tmdbMovie.poster_path,
        backdropPath: tmdbMovie.backdrop_path,
        releaseDate: tmdbMovie.release_date,
        voteAverage: tmdbMovie.vote_average,
        voteCount: tmdbMovie.vote_count,
        genres: tmdbMovie.genres,
        runtime: tmdbMovie.runtime,
        originalLanguage: tmdbMovie.original_language,
        popularity: tmdbMovie.popularity,
      });

      await movie.save();
    }

    res.json({
      success: true,
      data: movie,
    });
  } catch (error) {
    console.error("Get movie details error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get movie details",
    });
  }
};

// @desc    Get popular movies
// @route   GET /api/movies/popular
// @access  Public
const getPopularMovies = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const result = await tmdbService.getPopularMovies(page);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get popular movies error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get popular movies",
    });
  }
};

// @desc    Get genres
// @route   GET /api/movies/genres
// @access  Public
const getGenres = async (req, res) => {
  try {
    const genres = await tmdbService.getGenres();

    res.json({
      success: true,
      data: genres,
    });
  } catch (error) {
    console.error("Get genres error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get genres",
    });
  }
};

module.exports = {
  getRecommendations,
  getMovieDetails,
  getPopularMovies,
  getGenres,
};
