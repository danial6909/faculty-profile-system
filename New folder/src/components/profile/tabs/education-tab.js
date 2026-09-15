import { getTranslations } from "next-intl/server";
import { GraduationCap, Briefcase } from "lucide-react";

function Timeline({ items, renderTitle, renderMeta }) {
  return (
    <ol className="relative space-y-6 border-e-2 border-neutral-200 pe-5">
      {items.map((item, i) => (
        <li key={i} className="relative">
          <span className="absolute -end-[26px] top-1 size-3 rounded-full bg-brand ring-4 ring-brand-soft" />
          <p className="text-sm font-bold text-neutral-900">{renderTitle(item)}</p>
          <p className="mt-0.5 text-xs text-neutral-500">{renderMeta(item)}</p>
        </li>
      ))}
    </ol>
  );
}

export default async function EducationTab({ professor }) {
  const t = await getTranslations("EducationTab");

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-card">
        <h2 className="mb-5 flex items-center gap-2 font-bold text-neutral-900">
          <GraduationCap className="size-4 text-brand" />
          {t("educationTitle")}
        </h2>
        <Timeline
          items={professor.educationHistory}
          renderTitle={(item) => `${item.degree} — ${item.field}`}
          renderMeta={(item) => `${item.institution} · ${item.years}`}
        />
      </section>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-card">
        <h2 className="mb-5 flex items-center gap-2 font-bold text-neutral-900">
          <Briefcase className="size-4 text-brand" />
          {t("executiveTitle")}
        </h2>
        <Timeline
          items={professor.executiveRoles}
          renderTitle={(item) => item.title}
          renderMeta={(item) => `${item.org} · ${item.years}`}
        />
      </section>
    </div>
  );
}
