import { getTranslations } from "next-intl/server";
import { NotebookText, Sparkles } from "lucide-react";
import CitationChart from "../citation-chart";

export default async function BioTab({ professor }) {
  const t = await getTranslations("BioTab");

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-card">
        <h2 className="mb-4 flex items-center gap-2 font-bold text-neutral-900">
          <NotebookText className="size-4 text-brand" />
          {t("aboutTitle")}
        </h2>
        <p className="text-sm leading-8 text-neutral-600">{professor.summary}</p>

        <p className="mb-2 mt-6 text-xs font-semibold text-neutral-500">{t("citationTrendLabel")}</p>
        <CitationChart data={professor.citationChart} color={professor.themeColor} />
      </section>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-card">
        <h2 className="mb-4 flex items-center gap-2 font-bold text-neutral-900">
          <Sparkles className="size-4 text-brand" />
          {t("researchAreasTitle")}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {professor.researchAreas.map((area) => (
            <div key={area.title} className="rounded-xl bg-neutral-50 p-4">
              <h3 className="mb-1.5 text-sm font-bold text-neutral-800">{area.title}</h3>
              <p className="mb-3 text-xs leading-6 text-neutral-500">{area.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {area.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-neutral-600 ring-1 ring-neutral-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
