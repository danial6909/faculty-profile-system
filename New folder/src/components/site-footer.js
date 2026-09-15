import { getTranslations } from "next-intl/server";
import PlainLink from "next/link";
import { Link } from "@/i18n/navigation";
import { Globe2, FlaskConical, FileCheck2, Mail, MapPin } from "lucide-react";

export default async function SiteFooter() {
  const t = await getTranslations("Footer");
  const tHeader = await getTranslations("Header");

  const highlightCards = [
    { icon: Globe2, title: t("highlight1Title"), text: t("highlight1Text") },
    { icon: FlaskConical, title: t("highlight2Title"), text: t("highlight2Text") },
    { icon: FileCheck2, title: t("highlight3Title"), text: t("highlight3Text") },
  ];

  const linkColumns = [
    {
      title: t("orgLinksTitle"),
      links: [
        { label: t("facultiesLink"), href: "/faculties" },
        { label: t("journalsLink"), href: "/journals" },
        { label: t("panelLink"), href: "/panel", external: true },
      ],
    },
    {
      title: t("supportTitle"),
      links: [
        { label: t("phone"), href: "tel:02188990000" },
        { label: "faculty-support@ac.ir", href: "mailto:faculty-support@ac.ir" },
      ],
    },
    {
      title: t("referencesTitle"),
      links: [
        { label: t("iscLink"), href: "https://isc.ac" },
        { label: t("msrtLink"), href: "https://msrt.ir" },
        { label: t("accreditationLink"), href: "/about" },
      ],
    },
  ];

  return (
    <footer className="mt-16 border-t border-neutral-200 bg-primary-950 text-neutral-300">
      <div className="container-page grid grid-cols-1 gap-4 py-10 sm:grid-cols-3">
        {highlightCards.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-xl bg-white/5 p-5">
            <Icon className="mb-3 size-5 text-secondary-400" />
            <h3 className="mb-1.5 text-sm font-semibold text-white">{title}</h3>
            <p className="text-xs leading-6 text-neutral-400">{text}</p>
          </div>
        ))}
      </div>

      <div className="container-page grid grid-cols-1 gap-8 border-t border-white/10 py-10 sm:grid-cols-4">
        <div>
          <p className="mb-2 text-sm font-bold text-white">{tHeader("universityName")}</p>
          <p className="flex items-start gap-2 text-xs leading-6 text-neutral-400">
            <MapPin className="mt-0.5 size-3.5 shrink-0" />
            {t("address")}
          </p>
          <a
            href="mailto:faculty-support@ac.ir"
            className="mt-2 flex items-center gap-2 text-xs text-neutral-400 hover:text-white"
          >
            <Mail className="size-3.5" />
            faculty-support@ac.ir
          </a>
        </div>

        {linkColumns.map((col) => (
          <div key={col.title}>
            <p className="mb-3 text-xs font-semibold text-neutral-200">{col.title}</p>
            <ul className="space-y-2">
              {col.links.map((link) =>
                link.external ? (
                  <li key={link.label}>
                    <PlainLink href={link.href} className="text-xs text-neutral-400 hover:text-white">
                      {link.label}
                    </PlainLink>
                  </li>
                ) : (
                  <li key={link.label}>
                    <Link href={link.href} className="text-xs text-neutral-400 hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 py-4">
        <p className="container-page text-center text-[11px] text-neutral-500">{t("copyright")}</p>
      </div>
    </footer>
  );
}
