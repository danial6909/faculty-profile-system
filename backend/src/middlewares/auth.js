// این میدلور بررسی می‌کند کاربر توکن معتبر دارد یا نه
// اگر معتبر بود، req.user را پر می‌کند: { userId, role }

const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  // توکن یا از کوکی httpOnly خوانده می‌شود یا از هدر Authorization (برای تست با Postman)
  const tokenFromCookie = req.cookies?.token;
  const tokenFromHeader = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : null;

  const token = tokenFromCookie || tokenFromHeader;

  if (!token) {
    return res.status(401).json({ message: "ورود لازم است." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { userId, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: "توکن نامعتبر یا منقضی‌شده است." });
  }
}

module.exports = authMiddleware;
