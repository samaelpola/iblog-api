import multer from "multer";
import * as path from "node:path";
import * as fs from "node:fs";
import { StatusCodes } from "http-status-codes";
import { appConfig } from "../config/index.js";

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, appConfig.APP_DIR_IMG_TMP_PATH);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      const tmpName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, tmpName);
    },
  }),
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only image files are allowed."), false);
    }

    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

const removeUploadedFileMiddleware = (req, res, next) => {
  res.on("finish", () => {
    if (res.statusCode !== StatusCodes.CREATED && req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting file: ", err);
      });
    }
  });

  next();
};

export { upload, removeUploadedFileMiddleware };
