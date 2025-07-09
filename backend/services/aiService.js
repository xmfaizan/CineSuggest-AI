const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

class AIService {
  constructor() {
    this.imageCaption = null;
    this.textGenerator = null;
    this.modelsLoaded = false;
    this.transformers = null;
  }

  async loadTransformers() {
    if (!this.transformers) {
      this.transformers = await import("@xenova/transformers");
    }
    return this.transformers;
  }

  async loadModels() {
    if (this.modelsLoaded) return;

    try {
      console.log("Loading AI models...");

      // Load transformers dynamically
      const { pipeline } = await this.loadTransformers();

      // Load image captioning model (using a more reliable model)
      this.imageCaption = await pipeline(
        "image-to-text",
        "Salesforce/blip-image-captioning-base",
        {
          cache_dir: process.env.AI_MODEL_CACHE_DIR,
          quantized: false, // Disable quantization for now
        }
      );

      console.log("✅ AI models loaded successfully");
      this.modelsLoaded = true;
    } catch (error) {
      console.error("❌ Failed to load AI models:", error);
      throw new Error("AI models failed to load");
    }
  }

  async processImage(imagePath) {
    try {
      if (!this.modelsLoaded) {
        await this.loadModels();
      }

      // Optimize image for processing
      const processedImagePath = await this.optimizeImage(imagePath);

      // Generate caption
      const caption = await this.imageCaption(processedImagePath);

      // Clean up processed image
      if (processedImagePath !== imagePath) {
        fs.unlinkSync(processedImagePath);
      }

      return caption[0]?.generated_text || "Unable to analyze image";
    } catch (error) {
      console.error("Image processing error:", error);
      throw new Error("Failed to process image");
    }
  }

  async optimizeImage(imagePath) {
    try {
      const outputPath = path.join(
        path.dirname(imagePath),
        `optimized_${path.basename(imagePath)}`
      );

      await sharp(imagePath)
        .resize(224, 224, { fit: "contain" })
        .jpeg({ quality: 80 })
        .toFile(outputPath);

      return outputPath;
    } catch (error) {
      console.error("Image optimization error:", error);
      return imagePath; // Return original if optimization fails
    }
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

    return suggestions.length > 0 ? suggestions : ["popular movies"];
  }
}

module.exports = new AIService();
