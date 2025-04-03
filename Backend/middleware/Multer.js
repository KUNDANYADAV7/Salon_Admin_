import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.folder || "public/menservice"; // Default folder if not specified
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true }); // Ensure folder exists
    }
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Middleware function to set destination folder dynamically
export const setUploadFolder = (folderName) => (req, res, next) => {
  req.folder = `public/${folderName}`;
  next();
};

export const upload = multer({ storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
 });
