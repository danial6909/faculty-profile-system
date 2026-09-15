import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { BadgeCheck, Award, Handshake, BookOpen, Quote, LineChart, Download, CalendarClock } from "lucide-react";
import Button from "../ui/button";
import CopyLinkButton from "./copy-link-button";

const STAT_ICONS = { handshake: Handshake, book: BookOpen, quote: Quote, chart: LineChart };

export default async function ProfileHero({ professor }) {
  const t = await getTranslations("ProfileHero");

  return (
    <div className="bg-primary-900 text-white">
      <div className="container-page py-6">
        <nav aria-label={t("breadcrumbFaculties")} className="flex flex-wrap items-center gap-1.5 text-xs text-primary-300">
          <Link href="/" className="hover:text-white">
            {t("breadcrumbFaculties")}
          </Link>
          <span>›</span>
          <Link href="/" className="hover:text-white">
            {professor.department}
          </Link>
          <span>›</span>
          <Link href="/" className="hover:text-white">
            {professor.group}
          </Link>
          <span>›</span>
          <span className="text-primary-100">{t("breadcrumbProfileOf", { name: professor.fullName })}</span>
        </nav>

        <div className="mt-5 flex flex-col-reverse gap-6 lg:flex-row lg:items-start lg:justify-between">
          {/* ---- ستون متن ---- */}
          <div className="flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full border border-white/15 px-3 py-1 text-primary-100">
                {professor.department}
              </span>
              <span className="text-primary-400">·</span>
              <span className="rounded-full border border-white/15 px-3 py-1 text-primary-100">
                {professor.group}
              </span>
              <span className="text-primary-400">·</span>
              <span className="rounded-full bg-secondary-600 px-3 py-1 font-medium text-white">
                {professor.positionChip}
              </span>
            </div>

            <h1 className="text-2xl font-extrabold sm:text-3xl">{professor.fullName}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-primary-200 sm:text-base">
              {professor.summary}
            </p>
          </div>

          {/* ---- ستون آواتار + نشان‌ها ---- */}
          <div className="flex flex-col items-center gap-2 lg:items-end">
            <Image
              src={professor.avatarUrl}
              alt={professor.fullName}
              width={112}
              height={112}
              priority
              className="size-28 rounded-full object-cover ring-4 ring-white/10"
              style={{ boxShadow: `0 0 0 2px ${professor.themeColor}` }}
            />
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary-500/15 px-2.5 py-1 text-[11px] font-medium text-secondary-300">
              <BadgeCheck className="size-3.5" />
              {t("verified")}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-tertiary-500 px-3 py-1 text-xs font-semibold text-white">
              <Award className="size-3.5" />
              {professor.academicRank} ({professor.academicRankEn})
            </span>
            <span className="text-[11px] text-primary-300">{t("rankFrom", { faculty: professor.department })}</span>
          </div>
        </div>

        {/* ---- ردیف آمار ---- */}
        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {professor.heroStats.map((stat) => {
            const Icon = STAT_ICONS[stat.icon] ?? BookOpen;
            return (
              <div key={stat.label} className="rounded-2xl bg-white/5 p-4">
                <Icon className="mb-2 size-4 text-secondary-300" />
                <dd className="text-xl font-bold text-white">{stat.value}</dd>
                <dt className="text-xs text-primary-200">{stat.label}</dt>
                <p className="mt-0.5 text-[11px] text-primary-400">{stat.note}</p>
              </div>
            );
          })}
        </dl>

        {/* ---- اکشن‌ها ---- */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <CopyLinkButton tone="dark" />
          <a
            href={professor.resumeUrl}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-primary-100 transition-colors hover:bg-white/10"
          >
            <Download className="size-3.5" />
            {t("downloadResume")}
          </a>
          <Button as="a" href="#contact-form" variant="primary" size="sm">
            <CalendarClock className="size-3.5" />
            {t("scheduleMeeting")}
          </Button>
        </div>
      </div>
    </div>
  );
}