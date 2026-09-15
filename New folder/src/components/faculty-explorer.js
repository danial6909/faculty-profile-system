"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Search, SlidersHorizontal, LayoutGrid } from "lucide-react";
import ProfessorCard from "./professor-card";
import StatsBar from "./stats-bar";

const PAGE_SIZE = 4;

const toNumber = (str) => Number(String(str).replace(/[^\d]/g, "")) || 0;

export default function FacultyExplorer({ professors, faculties, researchFields, stats }) {
  const t = useTranslations("Hero");
  const tFilters = useTranslations("Filters");

  const [query, setQuery] = useState("");
  const [faculty, setFaculty] = useState("all");
  const [sortBy, setSortBy] = useState("citations");
  const [acceptingOnly, setAcceptingOnly] = useState(false);
  const [activeTag, setActiveTag] = useState(null);
  const [page, setPage] = useState(1);

  const sortOptions = [
    { value: "citations", label: tFilters("sortCitations") },
    { value: "articles", label: tFilters("sortArticles") },
    { value: "az", label: tFilters("sortAz") },
  ];

  const filtered = useMemo(() => {
    let list = professors.filter((p) => {
      const matchesQuery =
        !query.trim() ||
        [p.fullName, p.department, p.group, ...p.interests].some((field) =>
          field.toLowerCase().includes(query.trim().toLowerCase())
        );
      const matchesFaculty = faculty === "all" || p.department === faculty;
      const matchesAccepting = !acceptingOnly || Boolean(p.badge);
      const matchesTag = !activeTag || p.interests.includes(activeTag);
      return matchesQuery && matchesFaculty && matchesAccepting && matchesTag;
    });

    list = [...list].sort((a, b) => {
      if (sortBy === "citations") return toNumber(b.citationsCount) - toNumber(a.citationsCount);
      if (sortBy === "articles") return toNumber(b.articlesCount) - toNumber(a.articlesCount);
      return a.fullName.localeCompare(b.fullName);
    });

    return list;
  }, [professors, query, faculty, sortBy, acceptingOnly, activeTag]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const withPageReset = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  return (
    <>
      {/* ---- هیرو: عنوان + جست‌وجو + تگ‌های داغ (پس‌زمینه تیره برند) ---- */}
      <section className="relative overflow-hidden bg-primary-900 pb-24 pt-14 sm:pt-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="container-page relative text-center">
          <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-secondary-300">
            {t("eyebrow")}
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-2xl font-extrabold leading-relaxed text-white sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-primary-100 sm:text-base">
            {t("subtitle")}
          </p>

          <div className="mx-auto mt-6 max-w-2xl">
            <label htmlFor="faculty-search" className="sr-only">
              {t("searchPlaceholder")}
            </label>
            <div className="flex items-center gap-2 rounded-full bg-white p-1.5 shadow-card-hover">
              <Search className="ms-3 size-4 shrink-0 text-neutral-400" />
              <input
                id="faculty-search"
                type="search"
                value={query}
                onChange={(e) => withPageReset(setQuery)(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="min-w-0 flex-1 bg-transparent py-2 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none"
              />
              <kbd className="hidden shrink-0 rounded-md border border-neutral-200 px-1.5 py-0.5 text-[10px] text-neutral-400 sm:block">
                Ctrl + K
              </kbd>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-neutral-300">{t("popularFields")}</span>
              {researchFields.map((field) => (
                <button
                  key={field}
                  type="button"
                  onClick={() => withPageReset(setActiveTag)(activeTag === field ? null : field)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    activeTag === field
                      ? "bg-white text-primary-900"
                      : "bg-white/10 text-primary-100 hover:bg-white/20"
                  }`}
                >
                  {field}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <StatsBar stats={stats} />

      {/* ---- نوار فیلتر، گرید کارت‌ها و صفحه‌بندی (پس‌زمینه روشن) ---- */}
      <section className="container-page mt-10 pb-16">
        <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-500">
              <SlidersHorizontal className="size-3.5" />
              {tFilters("label")}
            </div>

            <select
              value={faculty}
              onChange={(e) => withPageReset(setFaculty)(e.target.value)}
              className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <option value="all">{tFilters("allFaculties")}</option>
              {faculties.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {tFilters("sortBy", { label: opt.label })}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-1.5 text-xs text-neutral-600">
              <input
                type="checkbox"
                checked={acceptingOnly}
                onChange={(e) => withPageReset(setAcceptingOnly)(e.target.checked)}
                className="size-3.5 rounded border-neutral-300 text-brand focus-visible:ring-brand"
              />
              {tFilters("acceptingOnly")}
            </label>
          </div>

          <p className="flex items-center gap-1.5 text-xs text-neutral-400">
            <LayoutGrid className="size-3.5" />
            {tFilters("showing", { shown: paginated.length, filtered: filtered.length, total: professors.length })}
          </p>
        </div>

        {paginated.length === 0 ? (
          <p className="mt-16 text-center text-sm text-neutral-500">{tFilters("noResults")}</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {paginated.map((professor) => (
              <ProfessorCard key={professor.slug} professor={professor} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <nav className="mt-8 flex items-center justify-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs text-neutral-600 disabled:opacity-40"
            >
              {tFilters("prev")}
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                aria-current={n === currentPage ? "page" : undefined}
                className={`size-8 rounded-full text-xs font-medium ${
                  n === currentPage ? "bg-brand text-brand-foreground" : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs text-neutral-600 disabled:opacity-40"
            >
              {tFilters("next")}
            </button>
          </nav>
        )}
      </section>
    </>
  );
}
