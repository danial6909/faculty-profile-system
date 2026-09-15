"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";

// پرچم رسمی و دقیق جمهوری اسلامی ایران
function IranFlag({ className = "w-6 h-4" }) {
  return (
    <svg 
      className={`rounded-[3px] shadow-xs shrink-0 object-cover ${className}`} 
      viewBox="0 0 630 360" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* نوار سبز */}
      <rect width="630" height="120" fill="#239F40" />
      {/* نوار سفید */}
      <rect y="120" width="630" height="120" fill="#FFFFFF" />
      {/* نوار قرمز */}
      <rect y="240" width="630" height="120" fill="#DA0000" />
      
      {/* نشان رسمی مرکز پرچم */}
      <g transform="translate(315, 180) scale(0.9)" fill="#DA0000">
        <path d="M 0,-62 C 2,-62 3.5,-50 3.5,-35 C 3.5,-10 0,25 0,55 C 0,25 -3.5,-10 -3.5,-35 C -3.5,-50 -2,-62 0,-62 Z"/>
        <path d="M -4.5,-71 L 4.5,-71 C 4.5,-66 -4.5,-66 -4.5,-71 Z"/>
        <path d="M 6,-38 C 18,-30 26,-10 26,12 C 26,38 12,50 0,52 C 14,46 18,30 18,12 C 18,-8 11,-24 6,-38 Z"/>
        <path d="M -6,-38 C -18,-30 -26,-10 -26,12 C -26,38 -12,50 0,52 C -14,46 -18,30 -18,12 C -18,-8 -11,-24 -6,-38 Z"/>
        <path d="M 10,53 C 28,48 48,30 48,0 C 48,-26 36,-42 28,-50 C 40,-38 56,-16 56,0 C 56,36 34,58 10,60 Z"/>
        <path d="M -10,53 C -28,48 -48,30 -48,0 C -48,-26 -36,-42 -28,-50 C -40,-38 -56,-16 -56,0 C -56,36 -34,58 -10,60 Z"/>
      </g>
    </svg>
  );
}

// پرچم رسمی بریتانیا (Union Jack)
function UKFlag({ className = "w-6 h-4" }) {
  return (
    <svg 
      className={`rounded-[3px] shadow-xs shrink-0 object-cover ${className}`} 
      viewBox="0 0 60 30" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="60" height="30" fill="#012169"/>
      <path d="M0 0 L60 30 M60 0 L0 30" stroke="#FFFFFF" strokeWidth="6"/>
      <path d="M0 0 L60 30 M60 0 L0 30" stroke="#C8102E" strokeWidth="2"/>
      <path d="M30 0 V30 M0 15 H60" stroke="#FFFFFF" strokeWidth="10"/>
      <path d="M30 0 V30 M0 15 H60" stroke="#C8102E" strokeWidth="6"/>
    </svg>
  );
}

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const toggleLocale = () => {
    const nextLocale = locale === "fa" ? "en" : "fa";
    router.replace({ pathname, params }, { locale: nextLocale });
  };

  const isFa = locale === "fa";

  return (
    <button
      type="button"
      onClick={toggleLocale}
      className="group flex items-center justify-center p-1.5 rounded-full bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200/80 hover:border-slate-300 transition-all duration-200 shadow-2xs hover:shadow-xs active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-500/30 cursor-pointer"
      aria-label={isFa ? "Switch to English" : "تغییر به زبان فارسی"}
      title={isFa ? "English" : "فارسی"}
    >
      {isFa ? (
        <IranFlag className="w-6 h-4" />
      ) : (
        <UKFlag className="w-6 h-4" />
      )}
    </button>
  );
}