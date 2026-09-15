import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // فقط مسیرهای عمومی (سایت اصلی و پروفایل اساتید) از میان‌افزار چندزبانگی
  // رد می‌شن؛ پنل ادمین/استاد و صفحه‌ی ورود عمداً بیرون از [locale] هستن و
  // نباید توسط next-intl بازنویسی بشن.
  matcher: ["/((?!api|_next|_vercel|panel|login|.*\\..*).*)"],
};
