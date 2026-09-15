import localFont from "next/font/local";
import "./globals.css";

// Self-hosted variable font (Vazirmatn, SIL OFL — see fonts/OFL-Vazirmatn.txt).
// Bundled locally instead of next/font/google so the site has zero
// dependency on Google's CDN at build or request time (relevant for an
// .ac.ir deployment where that reachability isn't guaranteed) and still
// gets next/font's automatic self-hosting benefits: no layout shift,
// preloaded, served from our own domain. Exposed as --font-vazirmatn and
// consumed by the --font-sans / --font-brand tokens in globals.css.
const vazirmatn = localFont({
  src: "./fonts/Vazirmatn-Variable.ttf",
  variable: "--font-vazirmatn",
  display: "swap",
  weight: "100 900",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://profile.example.ac.ir";
const siteName = "سامانه جامع هیئت علمی و پژوهشگران";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | دانشگاه`,
    template: `%s | ${siteName}`,
  },
  description:
    "دسترسی به سوابق علمی، مقالات، علایق پژوهشی و راه‌های ارتباطی اساتید و پژوهشگران برتر دانشگاه. جست‌وجوی تخصصی بر اساس دانشکده، گروه آموزشی و حوزه پژوهشی.",
  keywords: [
    "اساتید دانشگاه",
    "هیئت علمی",
    "پروفایل استاد",
    "پژوهشگران",
    "سوابق علمی",
    "دانشکده",
  ],
  authors: [{ name: siteName }],
  alternates: {
    canonical: "/",
    languages: {
      fa: "/",
      en: "/en",
    },
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: siteUrl,
    siteName,
    title: siteName,
    description:
      "دسترسی به سوابق علمی، مقالات، علایق پژوهشی و راه‌های ارتباطی اساتید و پژوهشگران برتر دانشگاه.",
    images: [{ url: "/og-cover.png", width: 1200, height: 630, alt: siteName }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: "سامانه جامع اعضای هیئت علمی و پژوهشگران دانشگاه",
    images: ["/og-cover.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  themeColor: "#0F2B48",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    name: siteName,
    url: siteUrl,
    sameAs: [],
  };

  return (
    <html lang="fa" dir="rtl" data-scroll-behavior="smooth" className={vazirmatn.variable}>
      <body>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}