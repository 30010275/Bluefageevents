const path = require('path');
const fs = require('fs');

const deleteFile = (filename) => {
  if (!filename) return;
  const filePath = path.join(__dirname, '..', 'uploads', path.basename(filename));
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted file: ${filePath}`);
    }
  } catch (error) {
    console.error(`Failed to delete file ${filePath}:`, error.message);
  }
};

const getFileUrl = (filename) => {
  if (!filename) return null;
  return `/uploads/${path.basename(filename)}`;
};

const ensureUploadDir = () => {
  const dir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

module.exports = { deleteFile, getFileUrl, ensureUploadDir };
