import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "profilePictures");

// ensure directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req: any, file, cb) => {
    const userId = req.params.userId; // from auth middleware

    if (!userId) {
      return cb(new Error("userId is required in params"), "");
    }
    const ext = path.extname(file.originalname).toLowerCase();

    cb(null, `${userId}${ext}`);
  },
});

export const uploadUserProfile = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // ✅ 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png"];

    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only JPG or PNG images are allowed"));
    }

    cb(null, true);
  },
});
