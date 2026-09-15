import { professors } from "@/lib/mock-professors";
import { routing } from "@/i18n/routing";

const localePrefix = (locale) => (locale === routing.defaultLocale ? "" : `/${locale}`);

export default function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://profile.example.ac.ir";
  const entries = [];

  for (const locale of routing.locales) {
    const prefix = localePrefix(locale);

    ["", "/faculties", "/journals", "/guide", "/about"].forEach((path) => {
      entries.push({
        url: `${siteUrl}${prefix}${path}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: path === "" ? 1 : 0.6,
      });
    });

    // TODO: وقتی src/lib/api.js وصل شد، این بخش با فهرست واقعی استادها از بک‌اند جایگزین شود.
    professors.forEach((p) => {
      entries.push({
        url: `${siteUrl}${prefix}/professor/${p.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    });
  }

  return entries;
}
