import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  getLocalizedProfessors,
  getResearchFields,
  facultyKeys,
  homeStats,
  formatNumber,
} from "@/lib/mock-professors";
import FacultyExplorer from "@/components/faculty-explorer";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t("homeTitle"),
    description: t("homeDescription"),
  };
}

export default async function HomePage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [tFaculty, tGroup, tRank, tRoom, tBadge, tHomeStats] = await Promise.all([
    getTranslations({ locale, namespace: "Faculty" }),
    getTranslations({ locale, namespace: "Group" }),
    getTranslations({ locale, namespace: "Rank" }),
    getTranslations({ locale, namespace: "RoomType" }),
    getTranslations({ locale, namespace: "Badge" }),
    getTranslations({ locale, namespace: "HomeStats" }),
  ]);

  const professors = getLocalizedProfessors(locale, {
    tFaculty,
    tGroup,
    tRank,
    tRoom,
    tBadge,
  });
  const faculties = facultyKeys.map((key) => tFaculty(key));
  const researchFields = getResearchFields(locale);
  const stats = homeStats.map((s) => ({
    ...s,
    formattedValue: formatNumber(s.value, locale, { plus: s.plus }),
  }));

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: professors.map((p, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Person",
        name: p.fullName,
        jobTitle: p.academicRank,
        affiliation: { "@type": "CollegeOrUniversity", name: p.department },
        url: `/professor/${p.slug}`,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <FacultyExplorer
        professors={professors}
        faculties={faculties}
        researchFields={researchFields}
        stats={stats}
      />
    </>
  );
}
