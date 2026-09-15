import { getTranslations } from "next-intl/server";
import { BookMarked } from "lucide-react";

export default async function TeachingTab({ professor }) {
  const t = await getTranslations("TeachingTab");

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-card">
      <h2 className="mb-5 flex items-center gap-2 font-bold text-neutral-900">
        <BookMarked className="size-4 text-brand" />
        {t("title")}
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {professor.teachingHistory.map((course) => (
          <div key={course.title} className="rounded-xl bg-neutral-50 p-4">
            <p className="text-sm font-bold text-neutral-800">{course.title}</p>
            <p className="mt-1 text-xs text-neutral-500">{course.level}</p>
            <p className="mt-2 inline-block rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-neutral-600 ring-1 ring-neutral-200">
              {course.term}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
