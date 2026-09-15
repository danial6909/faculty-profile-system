export default function robots() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://profile.example.ac.ir";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/panel", "/login"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
