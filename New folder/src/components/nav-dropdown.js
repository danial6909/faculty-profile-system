"use client";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

export default function NavDropdown({ label, items }) {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const isRtl = locale === "fa";
  const SubChevron = isRtl ? ChevronLeft : ChevronRight;

  return (
    <div
      className="relative flex items-center h-full"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* دکمه بازکننده منو */}
      <button
        type="button"
        className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
          ${isOpen ? "text-primary-900 bg-primary-50/80 shadow-xs" : "text-slate-700 hover:text-primary-900 hover:bg-slate-100/70"}
        `}
        aria-expanded={isOpen}
      >
        {label}
        <ChevronDown
          className={`size-3.5 transition-transform duration-200 ease-out text-slate-500 ${isOpen ? "rotate-180 text-primary-700" : ""}`}
        />
      </button>

      {/* پل نامرئی جهت جلوگیری از بسته شدن هنگام حرکت موس به سمت پایین */}
      {isOpen && <div className="absolute top-full start-0 w-full h-2 z-50" />}

      {/* منوی کشویی */}
      <div
        className={`absolute top-[calc(100%+4px)] start-0 min-w-[230px] z-50 transition-all duration-150 ease-out origin-top-start
          ${isOpen ? "opacity-100 translate-y-0 pointer-events-auto scale-100" : "opacity-0 -translate-y-1.5 pointer-events-none scale-95"}
        `}
      >
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl ring-1 ring-slate-900/10 overflow-hidden p-1.5 border border-slate-100 relative">
          {/* نوار رنگی بالای پنل */}
          <div className="absolute top-0 start-0 end-0 h-0.5 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-400 opacity-90" />

          <div className="relative z-10 space-y-0.5 pt-0.5">
            {items.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="group relative flex items-center justify-between ps-5 pe-3.5 py-2.5 text-xs sm:text-sm text-slate-700 font-medium rounded-xl hover:text-primary-950 hover:bg-gradient-to-r hover:from-primary-50/90 hover:to-slate-50/50 transition-all duration-200 ease-out"
                onClick={() => setIsOpen(false)}
              >
                {/* نوار رنگی عمودی و ثابت در هنگام هاور */}
                <span className="absolute start-1.5 top-2 bottom-2 w-[2.5px] bg-primary-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out pointer-events-none" />

                <span className="transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                  {item.label}
                </span>

                {/* فلش جهت‌دار هوشمند متناسب با زبان فعال (RTL / LTR) */}
                <SubChevron className="size-3.5 text-primary-600 opacity-0 group-hover:opacity-100 transition-all duration-200 shrink-0 ms-2 translate-x-1 rtl:-translate-x-1 group-hover:translate-x-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
