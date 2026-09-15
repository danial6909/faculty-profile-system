// داده‌ی نمایشی موقت — بعداً با src/lib/api.js از بک‌اند (Express + Prisma) جایگزین می‌شود.
// ---------------------------------------------------------------------
// استراتژی چندزبانگی این فایل:
// - مقادیر عددی با Intl.NumberFormat بر اساس locale فرمت می‌شن.
// - دانشکده/گروه/مرتبه/نوع اتاق/بج به‌جای متن آزاد "کلید" هستن و ترجمه‌شون
//   توی messages/fa.json و messages/en.json نگه داشته می‌شه.
// - interests (تگ‌های پژوهشی) عمداً ترجمه نمی‌شن؛ اصطلاحات فنی/بین‌المللی‌ان.
// - توابع زیر یک آبجکت `translators` می‌گیرن: خروجی چند getTranslations با
//   namespaceهای جدا (Faculty/Group/Rank/RoomType/Badge/ProfileGenerated) —
//   این تفکیک باعث می‌شه یک کلید (مثلاً نام دانشکده) هم توی صفحه‌ی پروفایل
//   هم توی فیلتر صفحه‌ی اصلی، بدون تکرار پیام، قابل استفاده باشه.
// ---------------------------------------------------------------------

export function formatNumber(value, locale, { plus = false } = {}) {
  const formatted = new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(value);
  return plus ? `${formatted}+` : formatted;
}

export const facultyKeys = [
  "computerEngineering",
  "electricalEngineering",
  "basicSciences",
  "managementEconomics",
  "medicineBiotech",
];

const RESEARCH_FIELDS = {
  fa: ["هوش مصنوعی", "بیوتکنولوژی", "اقتصاد دیجیتال", "نانوفناوری", "مهندسی نرم‌افزار"],
  en: ["Artificial Intelligence", "Biotechnology", "Digital Economy", "Nanotechnology", "Software Engineering"],
};

export function getResearchFields(locale) {
  return RESEARCH_FIELDS[locale] ?? RESEARCH_FIELDS.fa;
}

export const homeStats = [
  { key: "faculties", value: 12, icon: "building" },
  { key: "labs", value: 48, icon: "flask" },
  { key: "articles", value: 3400, plus: true, icon: "book" },
  { key: "activeFaculty", value: 184, icon: "users" },
];

export const professors = [
  {
    slug: "h-mohammadi",
    fullName: "دکتر حسین محمدی",
    fullNameEn: "Dr. Hossein Mohammadi",
    rank: "assistant",
    facultyKey: "computerEngineering",
    groupKey: "digitalSystems",
    avatarSeed: 12,
    themeColor: "#0F2B48",
    articlesCount: 24,
    citationsCount: 890,
    interests: ["Hardware Security", "Edge Computing", "IoT"],
    room: { type: "office", number: 203 },
    badgeKey: "hMohammadi",
    badgeTone: "secondary",
  },
  {
    slug: "m-soleimani",
    fullName: "دکتر مریم سلیمانی",
    fullNameEn: "Dr. Maryam Soleimani",
    rank: "associate",
    facultyKey: "medicineBiotech",
    groupKey: "biotechnology",
    avatarSeed: 47,
    themeColor: "#0D9488",
    articlesCount: 45,
    citationsCount: 2100,
    interests: ["Bioinformatics", "Genetic Engineering", "CRISPR"],
    room: { type: "lab", number: 3 },
    badgeKey: "mSoleimani",
    badgeTone: "secondary",
  },
  {
    slug: "a-rezaei",
    fullName: "دکتر علیرضا رضایی",
    fullNameEn: "Dr. Alireza Rezaei",
    rank: "full",
    facultyKey: "computerEngineering",
    groupKey: "aiRobotics",
    avatarSeed: 33,
    themeColor: "#D97706",
    articlesCount: 78,
    citationsCount: 4250,
    interests: ["Neural Networks", "Computer Vision", "Deep Learning"],
    room: { type: "office", number: 408 },
    badgeKey: "aRezaei",
    badgeTone: "primary",
  },
  {
    slug: "n-parsa",
    fullName: "دکتر نیلوفر پارسا",
    fullNameEn: "Dr. Niloofar Parsa",
    rank: "assistant",
    facultyKey: "basicSciences",
    groupKey: "dataScience",
    avatarSeed: 21,
    themeColor: "#0F2B48",
    articlesCount: 21,
    citationsCount: 940,
    interests: ["Health Data", "High-dim Analysis", "Biostatistics"],
    room: { type: "office", number: 305 },
    badgeKey: null,
    badgeTone: null,
  },
  {
    slug: "m-abbasi",
    fullName: "دکتر محمدرضا عباسی",
    fullNameEn: "Dr. Mohammadreza Abbasi",
    rank: "associate",
    facultyKey: "electricalEngineering",
    groupKey: "fluidDynamics",
    avatarSeed: 15,
    themeColor: "#0D9488",
    articlesCount: 38,
    citationsCount: 1650,
    interests: ["Renewable Energy", "Turbulence Modeling", "CFD Simulation"],
    room: { type: "office", number: 114 },
    badgeKey: "mAbbasi",
    badgeTone: "tertiary",
  },
  {
    slug: "s-kazemi",
    fullName: "دکتر سارا کاظمی",
    fullNameEn: "Dr. Sara Kazemi",
    rank: "full",
    facultyKey: "managementEconomics",
    groupKey: "financialEconomics",
    avatarSeed: 5,
    themeColor: "#D97706",
    articlesCount: 62,
    citationsCount: 3100,
    interests: ["Decision Science", "Fintech", "Behavioral Economics"],
    room: { type: "office", number: 510 },
    badgeKey: "sKazemi",
    badgeTone: "secondary",
  },
];

export function getAllProfessorSlugs() {
  return professors.map((p) => p.slug);
}

function localizeBase(base, locale, { tFaculty, tGroup, tRank, tRoom, tBadge }) {
  const fmt = (n, opts) => formatNumber(n, locale, opts);
  return {
    slug: base.slug,
    fullName: locale === "fa" ? base.fullName : base.fullNameEn,
    themeColor: base.themeColor,
    avatarSeed: base.avatarSeed,
    academicRank: tRank(base.rank),
    department: tFaculty(base.facultyKey),
    group: tGroup(base.groupKey),
    interests: base.interests,
    articlesCount: fmt(base.articlesCount),
    citationsCount: fmt(base.citationsCount),
    room: `${tRoom(base.room.type)} ${fmt(base.room.number)}`,
    badge: base.badgeKey ? { text: tBadge(base.badgeKey), tone: base.badgeTone } : null,
  };
}

// برای گرید صفحه‌ی اصلی — نسخه‌ی سبک (بدون بیوگرافی/بخش‌های پروفایل کامل).
export function getLocalizedProfessors(locale, translators) {
  return professors.map((base) => localizeBase(base, locale, translators));
}

const VENUE_POOL = [
  { name: "IEEE Transactions", tag: "Q1 · IF 7.4" },
  { name: "Elsevier Journal", tag: "Q1 · IF 6.1" },
  { name: "Springer Nature", tag: "Q2 · IF 3.8" },
  { name: "ACM Computing Surveys", tag: "Q1 · IF 9.0" },
];

const TAG_POOL = [
  ["Deep Learning", "Real-time Systems"],
  ["Optimization", "Simulation"],
  ["Applied Research", "Industry Collaboration"],
  ["Data-driven Methods", "Benchmarking"],
];

const RANK_ALWAYS_EN = {
  assistant: "Assistant Professor",
  associate: "Associate Professor",
  full: "Full Professor",
};

// برای صفحه‌ی پروفایل کامل. `translators` = { t (ProfileGenerated), tFaculty, tGroup, tRank, tRoom, tBadge }
export function getProfessorProfile(slug, locale, translators) {
  const base = professors.find((p) => p.slug === slug);
  if (!base) return null;

  const { t, tFaculty, tGroup, tRank, tRoom, tBadge } = translators;
  const idx = professors.findIndex((p) => p.slug === slug);
  const articles = base.articlesCount;
  const citations = base.citationsCount;
  const hIndex = 8 + (idx % 4) * 6 + Math.round(articles / 10);
  const projectsCount = 4 + (idx % 3) * 3;
  const experienceYears = 10 + idx * 2;
  const interests = base.interests;
  const fmt = (n, opts) => formatNumber(n, locale, opts);
  const facultyName = tFaculty(base.facultyKey);
  const groupName = tGroup(base.groupKey);
  const rankName = tRank(base.rank);
  const interestsList = new Intl.ListFormat(locale === "fa" ? "fa" : "en", {
    style: "long",
    type: "conjunction",
  }).format(interests);

  return {
    slug: base.slug,
    fullName: locale === "fa" ? base.fullName : base.fullNameEn,
    themeColor: base.themeColor,
    avatarUrl: `https://i.pravatar.cc/240?img=${base.avatarSeed}`,
    verified: true,
    department: facultyName,
    group: groupName,
    academicRank: rankName,
    academicRankEn: RANK_ALWAYS_EN[base.rank],
    interests,
    articlesCountRaw: fmt(articles),
    room: `${tRoom(base.room.type)} ${fmt(base.room.number)}`,
    positionChip: t("positionChip", { group: groupName }),
    summary: t("summary", {
      rankLevel: t(base.rank === "full" ? "rankLevelSenior" : "rankLevelActive"),
      interests: interestsList,
      years: fmt(experienceYears),
      projects: fmt(projectsCount),
    }),
    resumeUrl: "#",
    links: { orcid: "0000-0002-1234-5678", scholar: "#", researchgate: "#", github: "#" },
    officeHours: [
      { day: t("officeHours.mon"), time: `${fmt(10)}:00 - ${fmt(12)}:00` },
      { day: t("officeHours.wed"), time: `${fmt(14)}:00 - ${fmt(16)}:00` },
    ],
    heroStats: [
      { icon: "handshake", label: t("stat.projects"), value: fmt(projectsCount), note: t("stat.projectsNote") },
      { icon: "book", label: t("stat.articles"), value: fmt(articles), note: t("stat.articlesNote") },
      { icon: "quote", label: t("stat.citations"), value: fmt(citations), note: t("stat.citationsNote") },
      { icon: "chart", label: t("stat.hIndex"), value: fmt(hIndex), note: t("stat.hIndexNote") },
    ],
    citationChart: [2020, 2021, 2022, 2023, 2024].map((year, i) => ({
      year: String(year),
      citations: Math.round((citations / 5) * (0.5 + i * 0.28)),
    })),
    educationHistory: [
      {
        degree: t("degree.phd"),
        field: interests[0],
        institution: idx % 2 === 0 ? t("institution.sharif") : t("institution.tehran"),
        years: locale === "fa" ? "۱۳۹۰ - ۱۳۹۴" : "2011 - 2015",
      },
      {
        degree: t("degree.msc"),
        field: interests[1] ?? interests[0],
        institution: t("institution.amirkabir"),
        years: locale === "fa" ? "۱۳۸۷ - ۱۳۹۰" : "2008 - 2011",
      },
      {
        degree: t("degree.bsc"),
        field: facultyName,
        institution: t("institution.isfahan"),
        years: locale === "fa" ? "۱۳۸۳ - ۱۳۸۷" : "2004 - 2008",
      },
    ],
    executiveRoles: [
      { title: t("role.groupDirector", { group: groupName }), org: facultyName, years: t("years.currentSince1400") },
      { title: t("role.researchDeputy"), org: facultyName, years: t("years.1397to1400") },
    ],
    publications: interests.concat(interests[0]).slice(0, 4).map((interest, i) => {
      const venue = VENUE_POOL[i % VENUE_POOL.length];
      return {
        title: i % 2 === 0 ? `A Study on ${interest} Applications` : `Advances in ${interest}: A Comprehensive Review`,
        venue: venue.name,
        venueTag: venue.tag,
        year: String(2024 - i),
        citations: fmt(Math.max(8, Math.round(citations / (i + 4)))),
        openAccess: i % 2 === 0,
        doi: `10.1109/EXAMPLE.${2024 - i}.${1000 + idx * 7 + i}`,
      };
    }),
    teachingHistory: interests.map((interest, i) => ({
      title: t("course.advanced", { topic: interest }),
      level: i === 0 ? t("level.gradPhd") : i === 1 ? t("level.grad") : t("level.undergrad"),
      term: i === 0 ? t("term.current") : `${1401 + i} - ${1402 + i}`,
    })),
    researchAreas: [
      ...interests.map((interest, i) => ({
        title: interest,
        description: t("areaDescription", { topic: interest }),
        tags: TAG_POOL[i % TAG_POOL.length],
      })),
      {
        title: t("appliedAreaTitle"),
        description: t("appliedAreaDescription", { count: fmt(projectsCount) }),
        tags: ["Tech Transfer", "R&D Contracts"],
      },
    ].slice(0, 4),
    currentCourses: [
      { title: t("course.advanced", { topic: interests[0] }), code: t("level.gradPhd"), time: t("time.satMorning") },
      { title: t("course.fundamentals", { topic: interests[1] ?? interests[0] }), code: t("level.grad"), time: t("time.monAfternoon") },
    ],
    announcements: [
      { date: t("time.days12Ago"), title: t("announcement1Title"), excerpt: t("announcement1Text") },
      { date: t("time.weeks3Ago"), title: t("announcement2Title"), excerpt: t("announcement2Text") },
    ],
    gallery: [0, 1, 2].map((i) => `https://picsum.photos/seed/${base.slug}-${i}/480/360`),
    labHighlight: { text: base.badgeKey ? tBadge(base.badgeKey) : t("labHighlightFallback", { group: groupName }) },
    badge: base.badgeKey ? { text: tBadge(base.badgeKey), tone: base.badgeTone } : null,
  };
}