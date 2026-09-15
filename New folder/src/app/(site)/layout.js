import localFont from "next/font/local";
import "../globals.css";

// همون فونت self-host شده، فقط برای مسیرهای غیرعمومی (پنل/ورود) که فعلاً
// چندزبانه نیستن — همیشه فارسی/RTL.
const vazirmatn = localFont({
  src: "../fonts/Vazirmatn-Variable.ttf",
  variable: "--font-vazirmatn",
  display: "swap",
  weight: "100 900",
});

export const metadata = {
  title: "پنل مدیریت | سامانه جامع هیئت علمی و پژوهشگران",
  robots: { index: false, follow: false },
};

export default function SiteRootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" data-scroll-behavior="smooth" className={vazirmatn.variable}>
      <body>{children}</body>
    </html>
  );
}
