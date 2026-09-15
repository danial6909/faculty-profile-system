import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { User, GraduationCap, BookMarked, Library, Users, Handshake } from "lucide-react";
import { getProfessorProfile, getAllProfessorSlugs } from "@/lib/mock-professors";
import { routing } from "@/i18n/routing";
import ProfileHero from "@/components/profile/profile-hero";
import ProfileSidebar from "@/components/profile/profile-sidebar";
import ProfileTabs from "@/components/profile/profile-tabs";
import BioTab from "@/components/profile/tabs/bio-tab";
import EducationTab from "@/components/profile/tabs/education-tab";
import TeachingTab from "@/components/profile/tabs/teaching-tab";
import PublicationsTab from "@/components/profile/tabs/publications-tab";
import EmptyTab from "@/components/profile/tabs/empty-tab";

// دیتای Mock همیشه از قبل مشخصه، پس صفحات هر استاد در build-time به‌صورت
// استاتیک تولید می‌شن (SSG) — برای هر ترکیب locale × slug.
export function generateStaticParams() {
  const slugs = getAllProfessorSlugs();
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

async function loadProfessor(slug, locale) {
  const [t, tFaculty, tGroup, tRank, tRoom, tBadge] = await Promise.all([
    getTranslations({ locale, namespace: "ProfileGenerated" }),
    getTranslations({ locale, namespace: "Faculty" }),
    getTranslations({ locale, namespace: "Group" }),
    getTranslations({ locale, namespace: "Rank" }),
    getTranslations({ locale, namespace: "RoomType" }),
    getTranslations({ locale, namespace: "Badge" }),
  ]);

  return getProfessorProfile(slug, locale, { t, tFaculty, tGroup, tRank, tRoom, tBadge });
}

export async function generateMetadata({ params }) {
  const { slug, locale } = await params;
  const professor = await loadProfessor(slug, locale);
  if (!professor) return {};

  return {
    title: `${professor.fullName} | ${professor.department}`,
    description: `${professor.academicRank} ${professor.department} — ${professor.group}. ${professor.interests.join("، ")}.`,
    openGraph: {
      title: professor.fullName,
      description: `${professor.academicRank} — ${professor.group}`,
      images: [{ url: professor.avatarUrl }],
    },
  };
}

export default async function ProfessorProfilePage({ params }) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const professor = await loadProfessor(slug, locale);
  if (!professor) {
    notFound();
  }

  const tTabs = await getTranslations({ locale, namespace: "Tabs" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: professor.fullName,
    jobTitle: professor.academicRank,
    affiliation: { "@type": "CollegeOrUniversity", name: professor.department },
    email: `${professor.slug}@university.ac.ir`,
    knowsAbout: professor.interests,
  };

  const iconClass = "size-3.5";
  const tabs = [
    { id: "bio", label: tTabs("bio"), icon: <User className={iconClass} />, content: <BioTab professor={professor} /> },
    {
      id: "education",
      label: tTabs("education"),
      icon: <GraduationCap className={iconClass} />,
      content: <EducationTab professor={professor} />,
    },
    {
      id: "teaching",
      label: tTabs("teaching"),
      icon: <BookMarked className={iconClass} />,
      content: <TeachingTab professor={professor} />,
    },
    {
      id: "publications",
      label: tTabs("publications"),
      icon: <Library className={iconClass} />,
      count: professor.articlesCountRaw,
      content: <PublicationsTab professor={professor} />,
    },
    {
      id: "students",
      label: tTabs("students"),
      icon: <Users className={iconClass} />,
      content: <EmptyTab message={tTabs("emptyMessage")} />,
    },
    {
      id: "collaborators",
      label: tTabs("collaborators"),
      icon: <Handshake className={iconClass} />,
      content: <EmptyTab message={tTabs("emptyMessage")} />,
    },
  ];

  return (
    <div style={{ "--brand-primary": professor.themeColor }}>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ProfileHero professor={professor} />

      <div className="container-page grid grid-cols-1 gap-6 py-8 lg:grid-cols-[1fr_340px]">
        <div>
          <ProfileTabs tabs={tabs} />
        </div>
        <ProfileSidebar professor={professor} />
      </div>
    </div>
  );
}