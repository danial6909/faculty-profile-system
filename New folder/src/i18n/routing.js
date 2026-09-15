import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fa", "en"],
  defaultLocale: "fa",
  // فارسی بدون پیشوند ("/") چون زبان اصلی سایته، انگلیسی با پیشوند ("/en").
  localePrefix: "as-needed",
});
