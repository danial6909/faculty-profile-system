// npm run seed
// این اسکریپت یک ادمین، یک استاد، چند بخش پیش‌فرض و کمی داده نمونه می‌سازد

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // --- کاربر ادمین ---
  const adminPassword = await bcrypt.hash("Admin@123", 10);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@university.ac.ir" },
    update: {},
    create: {
      email: "admin@university.ac.ir",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // --- کاربر استاد ---
  const profPassword = await bcrypt.hash("Prof@123", 10);
  const profUser = await prisma.user.upsert({
    where: { email: "sadeghizadeh@university.ac.ir" },
    update: {},
    create: {
      email: "sadeghizadeh@university.ac.ir",
      password: profPassword,
      role: "PROFESSOR",
    },
  });

  const professor = await prisma.professor.upsert({
    where: { userId: profUser.id },
    update: {},
    create: {
      userId: profUser.id,
      slug: "sadeghizadeh",
      fullName: "دکتر صادقی‌زاده",
      department: "مهندسی کامپیوتر",
      academicRank: "دانشیار",
      themeColor: "#1b2a4a",
      themeFont: "vazirmatn",
    },
  });

  // --- بخش‌های پیش‌فرض ---
  const bioSection = await prisma.section.upsert({
    where: { key: "bio" },
    update: {},
    create: {
      key: "bio",
      titleFa: "درباره من",
      titleEn: "About Me",
      isRepeatable: false,
      order: 1,
      fields: {
        create: [{ key: "text", labelFa: "متن بیوگرافی", labelEn: "Bio text", fieldType: "TEXTAREA", order: 1 }],
      },
    },
  });

  const eduSection = await prisma.section.upsert({
    where: { key: "edu" },
    update: {},
    create: {
      key: "edu",
      titleFa: "سوابق تحصیلی",
      titleEn: "Education",
      isRepeatable: true,
      order: 2,
      fields: {
        create: [
          { key: "degree", labelFa: "مقطع", labelEn: "Degree", fieldType: "TEXT", order: 1 },
          { key: "field", labelFa: "رشته", labelEn: "Field", fieldType: "TEXT", order: 2 },
          { key: "school", labelFa: "دانشگاه", labelEn: "University", fieldType: "TEXT", order: 3 },
          { key: "year", labelFa: "سال", labelEn: "Year", fieldType: "TEXT", order: 4 },
        ],
      },
    },
  });

  const coursesSection = await prisma.section.upsert({
    where: { key: "courses" },
    update: {},
    create: {
      key: "courses",
      titleFa: "دروس تدریس‌شده",
      titleEn: "Courses Taught",
      isRepeatable: true,
      order: 3,
      fields: {
        create: [
          { key: "name", labelFa: "نام درس", labelEn: "Course name", fieldType: "TEXT", order: 1 },
          { key: "term", labelFa: "نیمسال", labelEn: "Term", fieldType: "TEXT", order: 2 },
        ],
      },
    },
  });

  // --- بخش «سوابق پژوهشی»: یک بخش والد (دسته‌بندی، خودش فرم ندارد) + دو زیربخش نمونه ---
  const researchSection = await prisma.section.upsert({
    where: { key: "research" },
    update: {},
    create: {
      key: "research",
      titleFa: "سوابق پژوهشی",
      titleEn: "Research Background",
      order: 4,
      placement: "TOP_MENU",
      // این بخش والد است — isRepeatable و fields برایش معنی ندارد چون خودش فرم مستقیم ندارد
    },
  });

  const journalPapersSection = await prisma.section.upsert({
    where: { key: "journal-papers" },
    update: {},
    create: {
      key: "journal-papers",
      titleFa: "مقالات چاپ‌شده در مجله",
      titleEn: "Journal Papers",
      isRepeatable: true,
      order: 1,
      parentSectionId: researchSection.id,
      fields: {
        create: [
          { key: "title", labelFa: "عنوان مقاله", labelEn: "Title", fieldType: "TEXT", order: 1 },
          { key: "journal", labelFa: "نام مجله", labelEn: "Journal", fieldType: "TEXT", order: 2 },
          { key: "year", labelFa: "سال انتشار", labelEn: "Year", fieldType: "TEXT", order: 3 },
        ],
      },
    },
  });

  const researchInterestsSection = await prisma.section.upsert({
    where: { key: "research-interests" },
    update: {},
    create: {
      key: "research-interests",
      titleFa: "زمینه‌های پژوهشی مورد علاقه",
      titleEn: "Research Interests",
      isRepeatable: false,
      order: 2,
      parentSectionId: researchSection.id,
      fields: {
        create: [{ key: "text", labelFa: "متن", labelEn: "Text", fieldType: "TEXTAREA", order: 1 }],
      },
    },
  });

  // --- بخش سایدباری نمونه: دروس جاری (placement=SIDEBAR) ---
  const currentCoursesSection = await prisma.section.upsert({
    where: { key: "current-courses" },
    update: {},
    create: {
      key: "current-courses",
      titleFa: "دروس جاری",
      titleEn: "Current Courses",
      isRepeatable: true,
      order: 5,
      placement: "SIDEBAR",
      fields: {
        create: [{ key: "name", labelFa: "نام درس", labelEn: "Course name", fieldType: "TEXT", order: 1 }],
      },
    },
  });

  // --- دیتای نمونه برای استاد ---
  await prisma.professorSectionData.createMany({
    data: [
      { professorId: professor.id, sectionId: bioSection.id, groupIndex: 0, fieldKey: "text", lang: "fa", value: "دانشیار گروه مهندسی کامپیوتر با گرایش هوش مصنوعی." },
      { professorId: professor.id, sectionId: eduSection.id, groupIndex: 0, fieldKey: "degree", lang: "fa", value: "دکتری" },
      { professorId: professor.id, sectionId: eduSection.id, groupIndex: 0, fieldKey: "field", lang: "fa", value: "هوش مصنوعی" },
      { professorId: professor.id, sectionId: eduSection.id, groupIndex: 0, fieldKey: "school", lang: "fa", value: "دانشگاه صنعتی شریف" },
      { professorId: professor.id, sectionId: eduSection.id, groupIndex: 0, fieldKey: "year", lang: "fa", value: "۱۳۹۵" },
      { professorId: professor.id, sectionId: coursesSection.id, groupIndex: 0, fieldKey: "name", lang: "fa", value: "یادگیری ماشین" },
      { professorId: professor.id, sectionId: coursesSection.id, groupIndex: 0, fieldKey: "term", lang: "fa", value: "نیمسال اول ۱۴۰۴" },
      { professorId: professor.id, sectionId: journalPapersSection.id, groupIndex: 0, fieldKey: "title", lang: "fa", value: "روشی نوین در پردازش زبان طبیعی فارسی" },
      { professorId: professor.id, sectionId: journalPapersSection.id, groupIndex: 0, fieldKey: "journal", lang: "fa", value: "مجله مهندسی کامپیوتر ایران" },
      { professorId: professor.id, sectionId: journalPapersSection.id, groupIndex: 0, fieldKey: "year", lang: "fa", value: "۱۴۰۲" },
      { professorId: professor.id, sectionId: researchInterestsSection.id, groupIndex: 0, fieldKey: "text", lang: "fa", value: "پردازش زبان طبیعی، یادگیری عمیق، بینایی ماشین." },
      { professorId: professor.id, sectionId: currentCoursesSection.id, groupIndex: 0, fieldKey: "name", lang: "fa", value: "شبکه‌های کامپیوتری پیشرفته" },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seed کامل شد.");
  console.log("ادمین:  admin@university.ac.ir / Admin@123");
  console.log("استاد:  sadeghizadeh@university.ac.ir / Prof@123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });