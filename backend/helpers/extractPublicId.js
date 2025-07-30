const extractCloudinaryPublicId = (url) => {
  if (!url) return null;

  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;

    const afterUpload = parts[1];

    // Remove version prefix if present (v123456/)
    const withoutVersion = afterUpload.replace(/^v\d+\//, "");

    // Remove file extension (e.g., .jpg, .png)
    const filePathWithoutExt = withoutVersion.replace(/\.[^/.]+$/, "");

    return filePathWithoutExt;
  } catch (err) {
    console.error("Cloudinary ID extraction error:", err);
    return null;
  }
};

module.exports = extractCloudinaryPublicId;
