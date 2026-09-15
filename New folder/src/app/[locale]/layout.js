import localFont from "next/font/local";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

const vazirmatn = localFont({
  src: "../fonts/Vazirmatn-Variable.ttf",
  variable: "--font-vazirmatn",
  display: "swap",
  weight: "100 900",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://profile.example.ac.ir";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const siteName = t("siteName");

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${t("homeTitle")} | ${siteName}`,
      template: `%s | ${siteName}`,
    },
    description: t("homeDescription"),
    authors: [{ name: siteName }],
    alternates: {
      canonical: locale === routing.defaultLocale ? "/" : `/${locale}`,
      languages: { fa: "/", en: "/en" },
    },
    openGraph: {
      type: "website",
      locale: locale === "fa" ? "fa_IR" : "en_US",
      url: siteUrl,
      siteName,
      title: siteName,
      description: t("homeDescription"),
      images: [{ url: "/og-cover.png", width: 1200, height: 630, alt: siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description: t("homeDescription"),
      images: ["/og-cover.png"],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    icons: { icon: "/favicon.ico" },
  };
}

export const viewport = {
  themeColor: "#0F2B48",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleRootLayout({ children, params }) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // برای صفحات استاتیک (SSG) لازمه — به کامپوننت‌های سرور اجازه می‌ده بدونن
  // این رندر برای کدوم locale انجام می‌شه، بدون این‌که به params وابسته بشن.
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Metadata" });
  const siteName = t("siteName");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    name: siteName,
    url: siteUrl,
    sameAs: [],
  };

  return (
    <html
      lang={locale}
      dir={locale === "fa" ? "rtl" : "ltr"}
      data-scroll-behavior="smooth"
      className={vazirmatn.variable}
    >
      <body>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
