import { getTranslations } from "next-intl/server";
import {
  Mail,
  Phone,
  DoorOpen,
  Clock,
  Copy,
  Megaphone,
  Images,
  FlaskConical,
  ArrowLeft,
} from "lucide-react";
import Badge from "../ui/badge";
import ContactMessageForm from "./contact-message-form";

export default async function ProfileSidebar({ professor }) {
  const t = await getTranslations("ProfileSidebar");
  const email = `${professor.slug}@university.ac.ir`;

  return (
    <div className="flex flex-col gap-5">
      {/* اطلاعات تماس و نشانی */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-card">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold text-neutral-900">
          <Mail className="size-4 text-brand" />
          {t("contactInfoTitle")}
        </h2>
        <ul className="space-y-3 text-xs text-neutral-600">
          <li className="flex items-center justify-between gap-2">
            <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-brand">
              <Mail className="size-3.5 text-neutral-400" />
              {email}
            </a>
            <Copy className="size-3.5 shrink-0 text-neutral-300" />
          </li>
          <li className="flex items-center gap-2">
            <Phone className="size-3.5 text-neutral-400" />
            {t("phone")}
          </li>
          <li className="flex items-center gap-2">
            <DoorOpen className="size-3.5 text-neutral-400" />
            {professor.department} — {professor.room}
          </li>
        </ul>

        <p className="mb-2 mt-4 text-[11px] font-semibold text-neutral-500">{t("officeHoursTitle")}</p>
        <ul className="space-y-1.5">
          {professor.officeHours.map((slot) => (
            <li
              key={slot.day}
              className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-1.5 text-xs text-neutral-600"
            >
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5 text-neutral-400" />
                {slot.day}
              </span>
              <span>{slot.time}</span>
            </li>
          ))}
        </ul>

        <p className="mb-2 mt-4 text-[11px] font-semibold text-neutral-500">{t("linksTitle")}</p>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          {Object.entries({
            "ORCID iD": professor.links.orcid,
            "Google Scholar": professor.links.scholar,
            GitHub: professor.links.github,
            ResearchGate: professor.links.researchgate,
          }).map(([label, href]) => (
            <a
              key={label}
              href={href.startsWith("http") || href === "#" ? href : "#"}
              className="rounded-lg border border-neutral-200 px-2.5 py-1.5 text-center text-neutral-600 hover:border-brand hover:text-brand"
            >
              {label}
            </a>
          ))}
        </div>
      </section>

      {/* دروس جاری نیم‌سال حاضر */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-card">
        <h2 className="mb-3 text-sm font-bold text-neutral-900">{t("currentCoursesTitle")}</h2>
        <ul className="space-y-2">
          {professor.currentCourses.map((course) => (
            <li key={course.title} className="rounded-lg bg-neutral-50 px-3 py-2 text-xs">
              <p className="font-medium text-neutral-800">{course.title}</p>
              <p className="mt-0.5 text-neutral-500">
                {course.code} · {course.time}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* تازه‌ترین اطلاعیه‌ها */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-card">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-neutral-900">
          <Megaphone className="size-4 text-brand" />
          {t("announcementsTitle")}
        </h2>
        <ul className="space-y-3">
          {professor.announcements.map((a) => (
            <li key={a.title} className="border-e-2 border-brand/30 pe-3 text-xs">
              <p className="text-[11px] text-neutral-400">{a.date}</p>
              <p className="mt-0.5 font-medium text-neutral-800">{a.title}</p>
              <p className="mt-0.5 leading-5 text-neutral-500">{a.excerpt}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* گالری و آزمایشگاه */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-card">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-neutral-900">
          <Images className="size-4 text-brand" />
          {t("galleryTitle")}
        </h2>
        <div className="grid grid-cols-3 gap-1.5">
          {professor.gallery.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element -- placeholder
            // موقتی از picsum؛ next/image optimizer با این سرویس گاهی ۴۰۳ می‌گیره.
            // وقتی عکس‌های واقعی از آپلود استاد اومد، برگرد به next/image.
            <img
              key={src}
              src={src}
              alt={`${professor.fullName} lab ${i + 1}`}
              loading="lazy"
              className="h-16 w-full rounded-lg object-cover"
            />
          ))}
        </div>
      </section>

      {/* آزمایشگاه با پذیرش فعال */}
      <section className="rounded-2xl border-2 border-secondary-200 bg-secondary-50 p-5">
        <div className="mb-2 flex items-center gap-2">
          <FlaskConical className="size-4 text-secondary-700" />
          <Badge tone="secondary">{t("activeAdmission")}</Badge>
        </div>
        <h3 className="mb-1 text-sm font-bold text-secondary-900">{professor.group}</h3>
        <p className="mb-3 text-xs leading-6 text-secondary-800">{professor.labHighlight.text}</p>
        <a
          href="#contact-form"
          className="inline-flex items-center gap-1 text-xs font-semibold text-secondary-700 hover:underline"
        >
          <ArrowLeft className="size-3.5" />
          {t("moreInfo")}
        </a>
      </section>

      {/* ارسال پیام مستقیم */}
      <section id="contact-form" className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-card">
        <h2 className="mb-3 text-sm font-bold text-neutral-900">{t("messageFormTitle")}</h2>
        <ContactMessageForm professorName={professor.fullName} />
      </section>
    </div>
  );
}
