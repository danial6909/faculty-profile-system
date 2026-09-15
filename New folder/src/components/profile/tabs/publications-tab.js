import { getTranslations } from "next-intl/server";
import { Library, Quote } from "lucide-react";
import Badge from "../../ui/badge";

export default async function PublicationsTab({ professor }) {
  const t = await getTranslations("PublicationsTab");

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-card">
      <h2 className="mb-5 flex items-center gap-2 font-bold text-neutral-900">
        <Library className="size-4 text-brand" />
        {t("title")}
      </h2>
      <ul className="space-y-4">
        {professor.publications.map((pub) => (
          <li key={pub.title} className="border-b border-neutral-100 pb-4 last:border-0 last:pb-0">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <Badge tone="primary">{pub.venueTag}</Badge>
              <span className="text-xs text-neutral-400">{pub.year}</span>
              {pub.openAccess && <Badge tone="secondary">{t("openAccess")}</Badge>}
            </div>
            <p className="text-sm font-semibold leading-6 text-neutral-800">{pub.title}</p>
            <p className="mt-1 text-xs text-neutral-500">
              {pub.venue} · DOI: {pub.doi}
            </p>
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-neutral-500">
              <Quote className="size-3.5" />
              {pub.citations} {t("citationsSuffix")}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
