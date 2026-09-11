// تنظیمات آپلود فایل با Multer — فقط عکس، حداکثر ۲ مگابایت
// استفاده: router.post('/avatar', upload.single('avatar'), controllerFn)

const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "..", "uploads"));
  },
  filename: (req, file, cb) => {
    // نام فایل تصادفی تا هیچ‌وقت تداخل یا حدس‌زدنی نباشد
    const ext = path.extname(file.originalname).toLowerCase();
    const randomName = crypto.randomBytes(16).toString("hex");
    cb(null, `${randomName}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  if (!ALLOWED_MIME.includes(file.mimetype)) {
    return cb(new Error("فقط فایل‌های JPG، PNG یا WebP مجاز هستند."));
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE_BYTES },
});

module.exports = upload;
