
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "blogify/post-images",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    // No strict transformation/cropping for post images, let them be natural or responsive
    // But maybe limit connection to reasonable size
  },
});

const postUpload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for high-quality post images
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

export default postUpload;
