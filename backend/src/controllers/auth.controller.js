const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/db");

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // ۷ روز
};

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "ایمیل و رمز عبور الزامی است." });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: "ایمیل یا رمز عبور اشتباه است." });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ message: "ایمیل یا رمز عبور اشتباه است." });
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  res.cookie("token", token, COOKIE_OPTIONS);

  return res.json({
    message: "ورود موفق",
    user: { id: user.id, email: user.email, role: user.role },
  });
}

async function logout(req, res) {
  res.clearCookie("token", COOKIE_OPTIONS);
  return res.json({ message: "خروج انجام شد." });
}

async function me(req, res) {
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: {
      id: true,
      email: true,
      role: true,
      professor: { select: { id: true, slug: true, fullName: true } },
    },
  });

  if (!user) return res.status(404).json({ message: "کاربر یافت نشد." });
  return res.json(user);
}

module.exports = { login, logout, me };
