"use client";

import { useTranslations } from "next-intl";
import { Building2, FlaskConical, BookOpen, Users } from "lucide-react";

const ICONS = { building: Building2, flask: FlaskConical, book: BookOpen, users: Users };

export default function StatsBar({ stats }) {
  const t = useTranslations("HomeStats");

  return (
    <div className="container-page -mt-10 relative z-10">
      <dl className="grid grid-cols-2 gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-card-hover sm:grid-cols-4 sm:gap-0 sm:divide-x sm:divide-x-reverse sm:divide-neutral-100 sm:p-6">
        {stats.map((stat) => {
          const Icon = ICONS[stat.icon] ?? Users;
          return (
            <div key={stat.key} className="flex items-center gap-3 px-2 sm:px-6">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-800">
                <Icon className="size-5" />
              </span>
              <div>
                <dd className="text-xl font-bold text-neutral-900">{stat.formattedValue}</dd>
                <dt className="text-[11px] text-neutral-500">{t(stat.key)}</dt>
              </div>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
