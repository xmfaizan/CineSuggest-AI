const path = require("path");
const fs = require("fs");

async function downloadModels() {
  console.log("🚀 Starting AI model download...");

  const modelCacheDir = path.join(__dirname, "..", "models");

  // Ensure models directory exists
  if (!fs.existsSync(modelCacheDir)) {
    fs.mkdirSync(modelCacheDir, { recursive: true });
  }

  try {
    console.log(
      "📥 Downloading image captioning model (Xenova/blip-base-caption)..."
    );
    console.log(
      "⚠️  This may take several minutes depending on your internet connection"
    );

    const { pipeline } = await import("@xenova/transformers");

    await pipeline("image-to-text", "Xenova/vit-gpt2-image-captioning", {
      cache_dir: modelCacheDir,
      quantized: false,
      progress_callback: (progress) => {
        if (progress.status === "downloading") {
          const percent = Math.round((progress.loaded / progress.total) * 100);
          process.stdout.write(`\r📊 Downloading: ${percent}%`);
        }
      },
    });

    console.log("\n✅ Image captioning model downloaded and cached!");
    console.log(`📁 Models cached in: ${modelCacheDir}`);
    console.log("💡 You can now start the server with: npm run dev");
  } catch (error) {
    console.error("❌ Error downloading models:", error);
    console.log("\n💡 Troubleshooting tips:");
    console.log("1. Check your internet connection");
    console.log(
      "2. Make sure you have enough disk space (models can be ~1-2GB)"
    );
    console.log("3. Try running the script again");
    console.log("4. Make sure you have Node.js version 14 or higher");
    process.exit(1);
  }
}

downloadModels();
