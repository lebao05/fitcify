const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const crypto  = require('crypto');

const generateRandomFilename = (ext) => `${crypto.randomBytes(16).toString('hex')}${ext}`;

const createUploader = ({ type, folder, mimePrefix, sizeLimitMB }) => {
  const absDir = path.resolve(__dirname, `../uploads/${folder}`);
  fs.mkdirSync(absDir, { recursive: true });

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, absDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, generateRandomFilename(ext));
    }
  });

  const fileFilter = (_req, file, cb) => {
    if (file.mimetype.startsWith(`${mimePrefix}/`)) cb(null, true);
    else cb(new Error(`Only ${type} files are allowed`), false);
  };

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: sizeLimitMB * 1024 * 1024 }
  });
};

const uploadService = {
  imageUploader: createUploader({
    type: 'image',
    folder: 'images',
    mimePrefix: 'image',
    sizeLimitMB: 2
  }),

  audioUploader: createUploader({
    type: 'audio',
    folder: 'audios',
    mimePrefix: 'audio',
    sizeLimitMB: 10
  })
};

module.exports = uploadService;
