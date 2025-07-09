// Fallback AI service for when models aren't loaded
class FallbackAiService {
  constructor() {
    this.modelsLoaded = false;
  }

  async loadModels() {
    console.log("⚠️  Using fallback AI service (no models loaded)");
    this.modelsLoaded = true;
  }

  async processImage(imagePath) {
    // Simple fallback - return generic description
    const imageKeywords = [
      "atmospheric scene",
      "cinematic moment",
      "dramatic lighting",
      "emotional scene",
      "beautiful composition",
      "artistic shot",
      "moody atmosphere",
      "stylistic scene",
    ];

    const randomKeyword =
      imageKeywords[Math.floor(Math.random() * imageKeywords.length)];
    return `A ${randomKeyword} that suggests themes of drama and visual storytelling`;
  }

  async generateMovieQuery(imageDescription, userPrompt, mood) {
    try {
      // Combine all inputs into a coherent movie search query
      let query = "";

      if (imageDescription) {
        query += `Based on image showing: ${imageDescription}. `;
      }

      if (userPrompt) {
        query += `User wants: ${userPrompt}. `;
      }

      if (mood) {
        query += `Mood/Genre: ${mood}. `;
      }

      // Create search terms for TMDB
      const searchTerms = this.extractSearchTerms(query);

      return {
        query: query.trim(),
        searchTerms,
        suggestions: this.generateMovieSuggestions(
          imageDescription,
          userPrompt,
          mood
        ),
      };
    } catch (error) {
      console.error("Query generation error:", error);
      throw new Error("Failed to generate movie query");
    }
  }

  extractSearchTerms(query) {
    // Extract key terms for movie search
    const keywords = [];
    const lowerQuery = query.toLowerCase();

    // Genre keywords
    const genres = [
      "action",
      "comedy",
      "drama",
      "horror",
      "romance",
      "sci-fi",
      "thriller",
      "fantasy",
      "mystery",
      "documentary",
    ];
    genres.forEach((genre) => {
      if (lowerQuery.includes(genre)) {
        keywords.push(genre);
      }
    });

    // Mood keywords
    const moods = [
      "dark",
      "light",
      "serious",
      "funny",
      "sad",
      "happy",
      "intense",
      "calm",
      "exciting",
      "boring",
    ];
    moods.forEach((mood) => {
      if (lowerQuery.includes(mood)) {
        keywords.push(mood);
      }
    });

    return keywords.length > 0 ? keywords.join(" ") : "popular movies";
  }

  generateMovieSuggestions(imageDescription, userPrompt, mood) {
    // Generate movie suggestions based on inputs
    const suggestions = [];

    if (mood) {
      suggestions.push(`${mood} movies`);
    }

    if (userPrompt) {
      suggestions.push(userPrompt);
    }

    if (imageDescription) {
      // Extract key visual elements
      const visualKeywords = imageDescription.split(" ").slice(0, 3).join(" ");
      suggestions.push(`movies with ${visualKeywords}`);
    }

    // Add some default suggestions if nothing else
    if (suggestions.length === 0) {
      suggestions.push(
        "popular movies",
        "trending films",
        "highly rated movies"
      );
    }

    return suggestions;
  }
}

module.exports = new FallbackAiService();
