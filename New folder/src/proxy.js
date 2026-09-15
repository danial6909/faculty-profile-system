
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // پنل ادمین/استاد بیرون از [locale] مونده و نباید توسط next-intl
  // بازنویسی بشه. login دیگه استثنا نیست چون الان زیر [locale] است.
  matcher: ["/((?!api|_next|_vercel|panel|.*\\..*).*)"],
};