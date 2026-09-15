"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { 
  X, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  Home, 
  GraduationCap, 
  BookOpen, 
  HelpCircle, 
  Info, 
  LogIn, 
  Sparkles,
  PhoneCall,
  ShieldCheck,
  Headphones
} from "lucide-react";
import Button from "./ui/button";

export default function MobileMenu({ 
  navItems = [], 
  loginLabel,
  portalTitle
}) {
  const t = useTranslations("Header");
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [openIndex, setOpenIndex] = useState(1);

  const locale = useLocale();
  const isRtl = locale === "fa";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleAccordion = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const getItemIcon = (index) => {
    switch (index) {
      case 0: return <Home className="size-4 shrink-0" />;
      case 1: return <GraduationCap className="size-4 shrink-0" />;
      case 2: return <BookOpen className="size-4 shrink-0" />;
      case 3: return <HelpCircle className="size-4 shrink-0" />;
      case 4: return <Info className="size-4 shrink-0" />;
      default: return <Sparkles className="size-4 shrink-0" />;
    }
  };

  const SubChevron = isRtl ? ChevronLeft : ChevronRight;
  const displayTitle = portalTitle || t("universityName");

  return (
    <div className="lg:hidden">
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex size-10 items-center justify-center rounded-xl bg-slate-100/90 text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/30 shadow-xs cursor-pointer"
        aria-label={isOpen ? t("closeMenu") : t("openMenu")}
      >
        <div className="flex flex-col justify-between w-4.5 h-3.5 transform transition-all duration-300">
          <span 
            className={`h-0.5 bg-current rounded-full transition-all duration-300 origin-left ${
              isOpen ? "rotate-45 translate-x-[2px] -translate-y-[1px] w-5" : "w-4.5"
            }`} 
          />
          <span 
            className={`h-0.5 bg-current rounded-full transition-all duration-300 ${
              isOpen ? "opacity-0 scale-x-0" : "w-3 group-hover:w-4.5"
            }`} 
          />
          <span 
            className={`h-0.5 bg-current rounded-full transition-all duration-300 origin-left ${
              isOpen ? "-rotate-45 translate-x-[2px] translate-y-[1px] w-5" : "w-3.5 group-hover:w-4.5"
            }`} 
          />
        </div>
      </button>

      {/* Portal Mobile Navigation Overlay */}
      {mounted && createPortal(
        <div
          dir={isRtl ? "rtl" : "ltr"}
          className={`fixed inset-0 h-screen w-screen z-[99999] transition-all duration-300 ${
            isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          {/* Backdrop with Blur */}
          <div
            className={`fixed inset-0 h-full w-full bg-slate-950/60 backdrop-blur-md transition-opacity duration-300  ${
              isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Drawer Body - Fixed width locked at w-[300px] sm:w-[340px] max-w-[85vw] */}
          <div
            onClick={(e) => e.stopPropagation()}
            className={`fixed inset-y-0 ${isRtl ? "right-0 border-l" : "left-0 border-r"} h-full w-[300px] sm:w-[340px] max-w-[85vw] shrink-0 bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col border-slate-200/80 z-[100000] overflow-hidden ${
              isOpen 
                ? "translate-x-0" 
                : isRtl ? "translate-x-full" : "-translate-x-full"
            }`}
          >
            {/* Ambient Background Glows */}
            <div className="absolute -top-24 -right-24 size-64 rounded-full bg-primary-500/10 blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 -left-28 size-56 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

            {/* Header Section */}
            <div className="relative z-10 flex items-center justify-between p-4 border-b border-slate-200/70 bg-white/90 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <img 
                    src="/logo/logo.png" 
                    alt="Logo" 
                    className="size-9 rounded-xl object-contain bg-slate-50 p-1 shadow-xs border border-slate-200/60"
                  />
                  {}
                  <span className="absolute -bottom-0.5 -right-0.5 flex size-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full size-2.5 bg-emerald-500 ring-2 ring-white" />
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug truncate">
                    {displayTitle}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="size-3 text-primary-600 shrink-0" />
                    <span className="text-[10px] font-medium text-slate-500 truncate">
                      {t("portalTag")}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={closeMenu}
                className="flex size-8 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-all active:scale-95 shrink-0 ms-2 cursor-pointer"
                aria-label={t("closeMenu")}
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Scrollable Navigation List */}
            <div className="relative z-10 flex-1 overflow-y-auto px-3.5 py-4 space-y-2 [scrollbar-gutter:stable]">
              {navItems.map((item, index) => {
                const subItems = item.items || item.children || item.subItems;
                const hasSubitems = Array.isArray(subItems) && subItems.length > 0;
                const isExpanded = openIndex === index;

                if (hasSubitems) {
                  return (
                    <div 
                      key={index} 
                      className={`rounded-2xl transition-all duration-200 border overflow-hidden ${
                        isExpanded 
                          ? "bg-primary-50/40 border-primary-200/80 shadow-xs ring-1 ring-primary-500/10" 
                          : "bg-slate-50/60 border-slate-200/60 hover:bg-slate-100/70 hover:border-slate-300"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={(e) => toggleAccordion(e, index)}
                        className="w-full flex items-center justify-between px-3.5 py-3 text-xs sm:text-sm font-bold text-slate-800 transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className={`p-2 rounded-xl transition-colors duration-200 shrink-0 ${
                            isExpanded 
                              ? "bg-primary-600 text-white shadow-xs" 
                              : "bg-slate-200/70 text-slate-700"
                          }`}>
                            {getItemIcon(index)}
                          </span>
                          <span className={`truncate ${isExpanded ? "text-primary-950 font-bold" : "text-slate-800"}`}>
                            {item.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 ms-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                            isExpanded 
                              ? "bg-primary-100 text-primary-800" 
                              : "bg-slate-200/80 text-slate-600"
                          }`}>
                            {subItems.length}
                          </span>
                          <ChevronDown
                            className={`size-4 text-slate-400 transition-transform duration-300 ease-out ${
                              isExpanded ? "rotate-180 text-primary-600" : ""
                            }`}
                          />
                        </div>
                      </button>

                      {/* Animated Accordion Submenu */}
                      <div
                        className={`grid transition-all duration-300 ease-in-out ${
                          isExpanded
                            ? "grid-rows-[1fr] opacity-100 pb-2"
                            : "grid-rows-[0fr] opacity-0 pb-0 pointer-events-none"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div
                            className={`space-y-1 ${
                              isRtl
                                ? "pe-1 ps-2.5 border-r-2 border-primary-500/80 mr-3.5"
                                : "ps-1 pe-2.5 border-l-2 border-primary-500/80 ml-3.5"
                            } pt-1`}
                          >
                            {subItems.map((subItem, subIndex) => (
                              <Link
                                key={subIndex}
                                href={subItem.href || "#"}
                                onClick={closeMenu}
                                className="group flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm text-slate-700 hover:text-primary-950 hover:bg-white transition-all duration-200 font-semibold active:scale-[0.98]"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <span className="size-1.5 rounded-full bg-slate-400 group-hover:bg-primary-600 group-hover:scale-125 transition-all duration-200 shrink-0" />
                                  <span className="truncate">{subItem.label}</span>
                                </div>
                                <SubChevron className="size-3.5 text-slate-400 group-hover:text-primary-600 group-hover:translate-x-[-3px] rtl:group-hover:translate-x-[3px] transition-all duration-200 shrink-0 ms-1" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={index}
                    href={item.href || "#"}
                    onClick={closeMenu}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all border ${
                      item.active
                        ? "bg-primary-600 text-white border-primary-600 shadow-sm"
                        : "bg-slate-50/60 text-slate-800 border-slate-200/60 hover:bg-slate-100/70 hover:border-slate-300"
                    }`}
                  >
                    <span className={`p-2 rounded-xl shrink-0 ${item.active ? "bg-white/20 text-white" : "bg-slate-200/70 text-slate-700"}`}>
                      {getItemIcon(index)}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}

              {/* Support Card */}
              <div className="mt-6 p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 text-white shadow-md relative overflow-hidden group">
                <div className="absolute -right-6 -bottom-6 size-24 rounded-full bg-primary-500/10 blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />
                <div className="flex items-center gap-3 relative z-10">
                  <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm text-amber-300 shrink-0">
                    <Headphones className="size-5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-white truncate">
                      {t("aboutContact")}
                    </span>
                    <span className="text-[10px] text-slate-300 truncate mt-0.5">
                      {t("portalTag")}
                    </span>
                  </div>
                </div>
                <Link
                  href="/contact"
                  onClick={closeMenu}
                  className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-xs text-white text-[11px] font-bold transition-all"
                >
                  <PhoneCall className="size-3.5" />
                  <span>{t("aboutContact")}</span>
                </Link>
              </div>
            </div>

            {/* Drawer Bottom Action Footer */}
            <div className="relative z-10 p-4 border-t border-slate-200/80 bg-slate-50/80 backdrop-blur-md shrink-0 space-y-2.5">
              <Button
                as={Link}
                href="/login"
                variant="primary"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold bg-primary-600 hover:bg-primary-700 text-white shadow-md transition-all active:scale-[0.99]"
                onClick={closeMenu}
              >
                <LogIn className="size-4" />
                <span>{loginLabel || t("login")}</span>
              </Button>

              <div className="flex items-center justify-between text-[10px] font-medium text-slate-500 px-1 pt-0.5">
                <span>{t("universityName")}</span>
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <span className="size-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  {t("portalTag")}
                </span>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}