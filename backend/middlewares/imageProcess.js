const sharp = require("sharp");
const path = require("path");
const fs = require("fs/promises");

const processImg = ({ width = 474, height = 474, quality = 100 } = {}) => {
  return async (req, res, next) => {
    if (!req.file || !req.file.path) return next();

    const inputPath = req.file.path;
    const outputName = `${Date.now()}-${Math.round(Math.random() * 1e6)}.jpeg`;
    const outputPath = path.join(path.dirname(inputPath), outputName);

    try {
      // Resize and convert to JPEG
      await sharp(inputPath)
        .resize(width, height, { fit: "cover" })
        .jpeg({ quality })
        .toFile(outputPath);

      // Small delay to avoid file lock issues
      await new Promise((r) => setTimeout(r, 100));

      // Try to delete original uploaded file
      try {
        await fs.unlink(inputPath);
      } catch (unlinkErr) {
        console.warn(
          `⚠️ Failed to delete temp file: ${inputPath}`,
          unlinkErr.message
        );
      }

      // Update req.file to point to processed image
      req.file.path = outputPath;
      req.file.filename = outputName;
      req.file.mimetype = "image/jpeg";

      next();
    } catch (err) {
      console.error("❌ Error processing image:", err.message);
      next(err);
    }
  };
};

module.exports = processImg;
