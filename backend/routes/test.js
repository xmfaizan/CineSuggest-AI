const express = require("express");
const router = express.Router();
const { upload, handleUploadError } = require("../middleware/upload");

// Use Hugging Face AI service
const aiService = require("../services/huggingfaceAiService");

// @route   POST /api/test/ai
// @desc    Test AI image processing
// @access  Public
const testAI = async (req, res) => {
  try {
    const imagePath = req.file?.path;

    if (!imagePath) {
      return res.status(400).json({
        success: false,
        error: "Please upload an image to test",
      });
    }

    console.log("🧪 Testing AI with image:", imagePath);

    // Process image with AI
    const description = await aiService.processImage(imagePath);

    console.log("🤖 AI Description:", description);

    // Generate movie query
    const movieQuery = await aiService.generateMovieQuery(
      description,
      "test prompt",
      "drama"
    );

    // Clean up uploaded file
    const fs = require("fs");
    fs.unlinkSync(imagePath);

    res.json({
      success: true,
      data: {
        imageDescription: description,
        movieQuery: movieQuery,
        message: "AI processing successful!",
      },
    });
  } catch (error) {
    console.error("AI Test Error:", error);

    // Clean up uploaded file if error occurs
    if (req.file?.path) {
      const fs = require("fs");
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      error: "AI test failed: " + error.message,
    });
  }
};

// Test endpoint
router.post("/ai", upload, handleUploadError, testAI);

// Test AI status with both ViT and text generation
router.get("/ai-status", async (req, res) => {
  try {
    await aiService.loadModels();

    let vitTest = { success: false, message: "Not tested" };
    let textTest = { success: false, message: "Not tested" };

    if (
      aiService.apiToken &&
      aiService.apiToken !== "your_huggingface_token_here"
    ) {
      // Test ViT model
      vitTest = await aiService.testViTConnection();

      try {
        console.log("🧪 Testing ");
        const testResponse = await aiService.featherlessClient.post(
          "/chat/completions",
          {
            model: "", //add your text generation model here,
            messages: [
              {
                role: "user",
                content:
                  "Recommend exactly 3 popular action movies. Return only the movie titles, one per line, no explanations.",
              },
            ],
            max_tokens: 100,
            temperature: 0.7,
            stream: false,
          }
        );

        const Response =
          testResponse.data?.choices?.[0]?.message?.content || "";
        textTest = {
          success: true,
          message: "✅ Working: " + Response.substring(0, 50) + "...",
        };
        console.log("✅  test successful:", Response);
      } catch (testError) {
        console.log(
          "❌ test failed:",
          testError.response?.data || testError.message
        );
        textTest = {
          success: false,
          message:
            "❌  Failed: " + (testError.response?.status || testError.message),
        };
      }
    }

    res.json({
      success: true,
      data: {
        modelsLoaded: aiService.modelsLoaded,
        tokenConfigured:
          aiService.apiToken &&
          aiService.apiToken !== "your_huggingface_token_here",
        vitModelTest: vitTest.success
          ? vitTest.message
          : `❌ ${vitTest.message}`,
        textGenerationTest: textTest.success
          ? textTest.message
          : `❌ ${textTest.message}`,
        message:
          vitTest.success && textTest.success
            ? "ViT + text gen models ready for intelligent movie recommendations!"
            : "Some models unavailable - using fallback where needed",
        workflow: [
          "1. ViT analyzes uploaded image → visual elements",
          "2. TextGen generates 10 movie titles based on ViT results + user text",
          "3. TMDB searches for those exact movie titles",
          "4. Display movie cards with posters and details",
        ],
        availableModels: [""],
      },
    });
  } catch (error) {
    res.json({
      success: true,
      data: {
        modelsLoaded: false,
        message: "Using fallback system only",
        error: error.message,
      },
    });
  }
});

module.exports = router;
