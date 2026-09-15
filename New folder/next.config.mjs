import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  // اجازه‌ی دسترسی به منابع داخلی Next.js dev (HMR + RSC navigation) از
  // روی IP شبکه‌ی محلی — بدون این، کلیک روی لینک‌ها هنگام باز بودن سایت
  // با آی‌پی به‌جای localhost بی‌صدا کار نمی‌کنه.
  allowedDevOrigins: ["169.254.72.75", "localhost", "127.0.0.1"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

export default withNextIntl(nextConfig);
