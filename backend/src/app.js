require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const publicRoutes = require("./routes/public.routes");
const adminRoutes = require("./routes/admin.routes");
const professorRoutes = require("./routes/professor.routes");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// فایل‌های آپلودشده (عکس‌ها) از این مسیر قابل دسترسی می‌شوند
app.use("/uploads", express.static("uploads"));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/professor", professorRoutes);

// هندلر ۴۰۴ برای مسیرهای نامعتبر API
app.use("/api", (req, res) => res.status(404).json({ message: "مسیر یافت نشد." }));

// هندلر خطای عمومی — از جمله خطاهای Multer (نوع/حجم فایل نامعتبر)
app.use((err, req, res, next) => {
  if (err.name === "MulterError" || err.message?.includes("مجاز")) {
    return res.status(400).json({ message: err.message || "خطا در آپلود فایل." });
  }
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "خطای سرور" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ سرور روی پورت ${PORT} اجرا شد — http://localhost:${PORT}`);
});
