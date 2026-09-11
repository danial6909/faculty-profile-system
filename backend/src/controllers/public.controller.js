const prisma = require("../config/db");

// GET /api/public/professors
async function listProfessors(req, res) {
  const professors = await prisma.professor.findMany({
    where: { isActive: true },
    select: {
      slug: true,
      fullName: true,
      department: true,
      academicRank: true,
      avatarUrl: true,
    },
    orderBy: { fullName: "asc" },
  });
  return res.json(professors);
}

// GET /api/public/professors/:slug?lang=fa
async function getProfessorProfile(req, res) {
  const { slug } = req.params;
  const lang = req.query.lang === "en" ? "en" : "fa";

  const professor = await prisma.professor.findUnique({
    where: { slug },
    include: {
      data: {
        where: { lang },
        orderBy: [{ sectionId: "asc" }, { groupIndex: "asc" }],
      },
    },
  });

  if (!professor || !professor.isActive) {
    return res.status(404).json({ message: "استاد یافت نشد." });
  }

  // فقط بخش‌های فعال را می‌خوانیم تا ترتیب و عنوان‌ها را داشته باشیم
  const sections = await prisma.section.findMany({
    where: { isActive: true },
    include: { fields: { orderBy: { order: "asc" } } },
    orderBy: { order: "asc" },
  });

  // دیتای استاد را بر اساس sectionId و groupIndex گروه‌بندی می‌کنیم
  const grouped = {}; // { [sectionId]: { [groupIndex]: { [fieldKey]: value } } }
  for (const row of professor.data) {
    grouped[row.sectionId] ??= {};
    grouped[row.sectionId][row.groupIndex] ??= {};
    grouped[row.sectionId][row.groupIndex][row.fieldKey] = row.value;
  }

  // فقط بخش‌هایی که استاد حداقل یک مقدار در آن‌ها دارد را برمی‌گردانیم
  const sectionsWithData = sections
    .map((section) => {
      const items = grouped[section.id] ? Object.values(grouped[section.id]) : [];
      return {
        key: section.key,
        title: lang === "en" ? section.titleEn : section.titleFa,
        isRepeatable: section.isRepeatable,
        fields: section.fields.map((f) => ({
          key: f.key,
          label: lang === "en" ? f.labelEn : f.labelFa,
          type: f.fieldType,
        })),
        items,
      };
    })
    .filter((s) => s.items.length > 0);

  return res.json({
    fullName: professor.fullName,
    department: professor.department,
    academicRank: professor.academicRank,
    avatarUrl: professor.avatarUrl,
    themeColor: professor.themeColor,
    themeFont: professor.themeFont,
    sections: sectionsWithData,
  });
}

module.exports = { listProfessors, getProfessorProfile };
