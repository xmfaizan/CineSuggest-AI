const axios = require("axios");

class TMDBService {
  constructor() {
    this.apiKey = process.env.TMDB_API_KEY;
    this.baseURL = process.env.TMDB_BASE_URL;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000, // 10 second timeout
      params: {
        api_key: this.apiKey,
      },
    });
  }

  async retryRequest(requestFn, maxRetries = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        console.log(
          `TMDB API attempt ${attempt}/${maxRetries} failed:`,
          error.code || error.message
        );

        if (attempt === maxRetries) {
          throw error;
        }

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, delay * attempt));
      }
    }
  }

  async searchMovies(query, page = 1) {
    try {
      const response = await this.retryRequest(() =>
        this.client.get("/search/movie", {
          params: {
            query,
            page,
            include_adult: false,
          },
        })
      );
      return response.data;
    } catch (error) {
      console.error("TMDB Search Error:", error.code || error.message);

      // Return fallback popular movies if search fails
      console.log("🔄 Falling back to popular movies due to search error");
      try {
        return await this.getPopularMovies(page);
      } catch (fallbackError) {
        // If even popular movies fail, return mock data
        console.log("🔄 Using mock movie data due to API issues");
        return this.getMockMovieData();
      }
    }
  }

  async getMovieDetails(movieId) {
    try {
      const response = await this.retryRequest(() =>
        this.client.get(`/movie/${movieId}`)
      );
      return response.data;
    } catch (error) {
      console.error("TMDB Details Error:", error.code || error.message);
      throw new Error("Failed to get movie details");
    }
  }

  async getMoviesByGenre(genreId, page = 1) {
    try {
      const response = await this.retryRequest(() =>
        this.client.get("/discover/movie", {
          params: {
            with_genres: genreId,
            page,
            sort_by: "popularity.desc",
          },
        })
      );
      return response.data;
    } catch (error) {
      console.error("TMDB Genre Error:", error.code || error.message);
      // Fall back to popular movies
      return await this.getPopularMovies(page);
    }
  }

  async getGenres() {
    try {
      const response = await this.retryRequest(() =>
        this.client.get("/genre/movie/list")
      );
      return response.data.genres;
    } catch (error) {
      console.error("TMDB Genres Error:", error.code || error.message);
      // Return default genres if API fails
      return this.getDefaultGenres();
    }
  }

  async getPopularMovies(page = 1) {
    try {
      const response = await this.retryRequest(() =>
        this.client.get("/movie/popular", {
          params: { page },
        })
      );
      return response.data;
    } catch (error) {
      console.error("TMDB Popular Error:", error.code || error.message);
      // Return mock data if even popular movies fail
      return this.getMockMovieData();
    }
  }

  // Fallback mock data for when API is completely unavailable
  getMockMovieData() {
    return {
      results: [
        {
          id: 1,
          title: "The Shawshank Redemption",
          overview:
            "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
          poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
          backdrop_path: "/xBKGJQsAIeweesB79KC89FpBrVr.jpg",
          release_date: "1994-09-23",
          vote_average: 8.7,
          vote_count: 26000,
          genre_ids: [18],
          popularity: 95.0,
          original_language: "en",
        },
        {
          id: 2,
          title: "The Godfather",
          overview:
            "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
          poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
          backdrop_path: "/tmU7GeKVybMWFButWEGl2M4GeiP.jpg",
          release_date: "1972-03-14",
          vote_average: 8.7,
          vote_count: 18500,
          genre_ids: [18, 80],
          popularity: 90.0,
          original_language: "en",
        },
        {
          id: 3,
          title: "The Dark Knight",
          overview:
            "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
          poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
          backdrop_path: "/dqK9Hag1054tghRQSqLSfrkvQnA.jpg",
          release_date: "2008-07-18",
          vote_average: 8.5,
          vote_count: 31000,
          genre_ids: [28, 80, 18],
          popularity: 88.0,
          original_language: "en",
        },
        {
          id: 4,
          title: "Pulp Fiction",
          overview:
            "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
          poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
          backdrop_path: "/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
          release_date: "1994-09-10",
          vote_average: 8.5,
          vote_count: 26500,
          genre_ids: [80, 18],
          popularity: 85.0,
          original_language: "en",
        },
        {
          id: 5,
          title: "Inception",
          overview:
            "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
          poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
          backdrop_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
          release_date: "2010-07-16",
          vote_average: 8.4,
          vote_count: 33000,
          genre_ids: [28, 878, 53],
          popularity: 92.0,
          original_language: "en",
        },
      ],
      total_pages: 1,
      total_results: 5,
    };
  }

  // Default genres for when API fails
  getDefaultGenres() {
    return [
      { id: 28, name: "Action" },
      { id: 12, name: "Adventure" },
      { id: 16, name: "Animation" },
      { id: 35, name: "Comedy" },
      { id: 80, name: "Crime" },
      { id: 99, name: "Documentary" },
      { id: 18, name: "Drama" },
      { id: 10751, name: "Family" },
      { id: 14, name: "Fantasy" },
      { id: 36, name: "History" },
      { id: 27, name: "Horror" },
      { id: 10402, name: "Music" },
      { id: 9648, name: "Mystery" },
      { id: 10749, name: "Romance" },
      { id: 878, name: "Science Fiction" },
      { id: 10770, name: "TV Movie" },
      { id: 53, name: "Thriller" },
      { id: 10752, name: "War" },
      { id: 37, name: "Western" },
    ];
  }
}

module.exports = new TMDBService();
