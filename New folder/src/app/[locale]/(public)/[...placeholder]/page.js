import { getTranslations } from "next-intl/server";
import { Construction, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

// این فایل هر آدرسی زیر (public) رو می‌گیره که جای دیگه‌ای page.js واقعی
// نداره (مثلاً /journals، /guide، /faculties/computer-engineering).
// وقتی بعداً برای یکی از این‌ها صفحه‌ی واقعی ساختی (مثلاً یک فایل واقعی
// در journals/page.js)، Next.js خودکار همون رو به این کچ‌آل ترجیح می‌ده.

const SECTION_LABEL_KEYS = {
  faculties: "Header.facultiesLabel",
  journals: "Header.journalsLabel",
  articles: "Header.journalsLabel",
  guide: "Header.guide",
  about: "Header.aboutLabel",
  contact: "Header.aboutLabel",
};

function humanize(segment) {
  return segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata() {
  const t = await getTranslations("ComingSoon");
  return {
    title: t("title"),
    robots: { index: false, follow: true }, // تا وقتی محتوای واقعی نداره ایندکس نشه
  };
}

export default async function ComingSoonPage({ params }) {
  const { placeholder } = await params; // آرایه‌ی بخش‌های آدرس، مثلاً ["faculties","computer-engineering"]
  const t = await getTranslations();
  const tComingSoon = await getTranslations("ComingSoon");

  const [firstSegment, secondSegment] = placeholder;
  const sectionLabelKey = SECTION_LABEL_KEYS[firstSegment];
  const sectionLabel = sectionLabelKey ? t(sectionLabelKey) : humanize(firstSegment);
  const subLabel = secondSegment ? humanize(secondSegment) : null;

  return (
    <div className="container-page flex flex-col items-center justify-center py-24 text-center">
      <Construction className="mb-4 size-10 text-neutral-300" />
      <p className="mb-1 text-xs font-semibold text-brand">
        {sectionLabel}
        {subLabel ? ` — ${subLabel}` : ""}
      </p>
      <h1 className="mb-2 text-xl font-bold text-neutral-900">{tComingSoon("title")}</h1>
      <p className="mb-6 max-w-md text-sm leading-7 text-neutral-500">{tComingSoon("description")}</p>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-medium text-brand-foreground"
      >
        <ArrowRight className="size-4" />
        {tComingSoon("backHome")}
      </Link>
    </div>
  );
}