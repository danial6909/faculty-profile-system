// یک نمونه واحد از PrismaClient برای کل پروژه
// (ساخت چندباره PrismaClient در توسعه باعث اتصال‌های اضافه به دیتابیس می‌شود)

const { PrismaClient } = require("@prisma/client");

const prisma = global.__prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.__prisma = prisma;
}

module.exports = prisma;
