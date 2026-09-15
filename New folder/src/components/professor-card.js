"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { DoorOpen, Mail, CheckCircle2 } from "lucide-react";
import Button from "./ui/button";

export default function ProfessorCard({ professor }) {
  const t = useTranslations("ProfessorCard");
  const {
    slug,
    fullName,
    academicRank,
    group,
    avatarSeed,
    themeColor,
    articlesCount,
    citationsCount,
    interests,
    room,
    badge,
  } = professor;

  return (
    <article
      className="group flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
      style={{ "--brand-primary": themeColor }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Image
            src={`https://i.pravatar.cc/160?img=${avatarSeed}`}
            alt={fullName}
            width={56}
            height={56}
            className="size-14 shrink-0 rounded-full object-cover ring-2 ring-white shadow-card"
          />
          <div>
            <p className="text-xs font-semibold text-brand">{academicRank}</p>
            <h3 className="font-bold text-neutral-900 leading-snug">
              <Link href={`/professor/${slug}`} className="hover:text-brand transition-colors">
                {fullName}
              </Link>
            </h3>
          </div>
        </div>
      </div>

      <p className="mt-2 text-sm text-neutral-500">{group}</p>

      <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-neutral-50 py-3 text-center">
        <div>
          <p className="text-lg font-bold text-neutral-900">{articlesCount}</p>
          <p className="text-[11px] text-neutral-500">{t("articles")}</p>
        </div>
        <div className="border-e border-neutral-200">
          <p className="text-lg font-bold text-neutral-900">{citationsCount}</p>
          <p className="text-[11px] text-neutral-500">{t("citations")}</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-medium text-neutral-500">{t("interests")}</p>
        <div className="flex flex-wrap gap-1.5">
          {interests.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-medium text-brand"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {badge && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-secondary-700">
          <CheckCircle2 className="size-3.5 shrink-0" />
          {badge.text}
        </p>
      )}

      <div className="mt-5 flex items-center gap-2 border-t border-neutral-100 pt-4">
        <Button as={Link} href={`/professor/${slug}`} variant="primary" size="sm" className="flex-1">
          {t("viewProfile")}
        </Button>
        <span className="flex items-center gap-1 text-xs text-neutral-400">
          <DoorOpen className="size-3.5" />
          {room}
        </span>
        <a
          href={`/professor/${slug}#contact`}
          aria-label={t("emailAria", { name: fullName })}
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-brand"
        >
          <Mail className="size-4" />
        </a>
      </div>
    </article>
  );
}
