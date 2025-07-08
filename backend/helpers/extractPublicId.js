const extractCloudinaryPublicId = (url) => {
  if (!url) return null;
  const parts = url.split("/upload/");
  if (parts.length !== 2) return null;

  const filePath = parts[1].split(".")[0];  
  const cleanPath = filePath.replace(/^v\d+\//, ""); 
  return cleanPath;
};

module.exports = extractCloudinaryPublicId;