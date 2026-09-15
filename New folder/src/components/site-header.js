import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LogIn } from "lucide-react";
import NavDropdown from "./nav-dropdown";
import MobileMenu from "./mobile-menu";
import LocaleSwitcher from "./locale-switcher";

export default async function SiteHeader() {
  const t = await getTranslations("Header");
  const tFaculty = await getTranslations("Faculty");

  const navItems = [
    { label: t("home"), href: "/", active: true },
    {
      label: t("facultiesLabel"),
      items: [
        {
          label: tFaculty("computerEngineering"),
          href: "/faculties/computer-engineering",
        },
        {
          label: tFaculty("electricalEngineering"),
          href: "/faculties/electrical-engineering",
        },
        { label: tFaculty("basicSciences"), href: "/faculties/basic-sciences" },
        {
          label: tFaculty("managementEconomics"),
          href: "/faculties/management-economics",
        },
      ],
    },
    {
      label: t("journalsLabel"),
      items: [
        { label: t("journalsIndexed"), href: "/journals" },
        { label: t("articlesLatest"), href: "/articles" },
      ],
    },
    { label: t("guide"), href: "/guide" },
    {
      label: t("aboutLabel"),
      items: [
        { label: t("aboutIntro"), href: "/about" },
        { label: t("aboutContact"), href: "/contact" },
      ],
    },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <img
            src="/logo/logo.png"
            alt={t("universityName")}
            className="flex size-11 items-center justify-center rounded-lg text-brand-foreground font-bold text-sm"
          />

          <span className="hidden sm:flex flex-col leading-tight">
            <span className="text-sm font-bold text-primary-900">
              {t("universityName")}
            </span>
            <span className="text-[11px] text-neutral-500">
              {t("portalTag")}
            </span>
          </span>
        </Link>
        <nav
          aria-label={t("home")}
          className="hidden lg:flex items-center gap-1.5 sm:gap-2"
        >
          {navItems.map((item) =>
            item.items ? (
              <NavDropdown
                key={item.label}
                label={item.label}
                items={item.items}
              />
            ) : (
              <Link
                key={item.label}
                href={item.href}
                aria-current={item.active ? "page" : undefined}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  item.active
                    ? "text-primary-900 bg-primary-50/80 font-semibold shadow-xs"
                    : "text-slate-700 hover:text-primary-900 hover:bg-slate-100/70"
                }`}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <LocaleSwitcher />

          <Link
            href="/login"
            className="group relative hidden sm:inline-flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-primary-800 hover:bg-primary-900 rounded-xl shadow-sm hover:shadow-md hover:shadow-primary-900/20 active:scale-[0.98] transition-all duration-300 overflow-hidden ring-1 ring-white/10"
          >
            {/* افکت نوری شاین هنگام هاور */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

            <LogIn className="size-4 text-primary-100 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5 shrink-0" />
            <span className="relative z-10">{t("login")}</span>
          </Link>

          <MobileMenu
            navItems={navItems}
            loginLabel={t("login")}
            portalTitle={t("universityName")}
          />
        </div>
      </div>
    </header>
  );
}
