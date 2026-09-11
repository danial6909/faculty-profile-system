const prisma = require("../config/db");

// کمکی: گرفتن رکورد Professor بر اساس کاربر لاگین‌شده
async function getOwnProfessor(userId) {
  const professor = await prisma.professor.findUnique({ where: { userId } });
  if (!professor) {
    const err = new Error("حساب استاد یافت نشد.");
    err.status = 404;
    throw err;
  }
  return professor;
}

// کمکی: گرفتن یک بخش فعال بر اساس key
async function getActiveSectionByKey(key) {
  const section = await prisma.section.findFirst({
    where: { key, isActive: true },
    include: { fields: { orderBy: { order: "asc" } } },
  });
  if (!section) {
    const err = new Error("این بخش وجود ندارد یا غیرفعال است.");
    err.status = 404;
    throw err;
  }
  return section;
}

// GET /api/professor/profile
async function getProfile(req, res) {
  const professor = await getOwnProfessor(req.user.userId);
  return res.json(professor);
}

// PATCH /api/professor/profile   body: { avatarUrl? }
async function updateProfile(req, res) {
  const professor = await getOwnProfessor(req.user.userId);
  const { avatarUrl } = req.body;
  const updated = await prisma.professor.update({
    where: { id: professor.id },
    data: { avatarUrl },
  });
  return res.json(updated);
}

// PATCH /api/professor/theme   body: { themeColor?, themeFont? }
async function updateTheme(req, res) {
  const professor = await getOwnProfessor(req.user.userId);
  const { themeColor, themeFont } = req.body;
  const updated = await prisma.professor.update({
    where: { id: professor.id },
    data: { themeColor, themeFont },
  });
  return res.json(updated);
}

// GET /api/professor/sections  -> فقط تعریف بخش‌های فعال (بدون دیتا)، برای ساخت منو/فرم پویا
async function listActiveSections(req, res) {
  const sections = await prisma.section.findMany({
    where: { isActive: true },
    include: { fields: { orderBy: { order: "asc" } } },
    orderBy: { order: "asc" },
  });
  return res.json(sections);
}

// GET /api/professor/sections/:key/data?lang=fa
// خروجی: [{ groupIndex, values: { fieldKey: value } }]
async function getSectionData(req, res) {
  const professor = await getOwnProfessor(req.user.userId);
  const section = await getActiveSectionByKey(req.params.key);
  const lang = req.query.lang === "en" ? "en" : "fa";

  const rows = await prisma.professorSectionData.findMany({
    where: { professorId: professor.id, sectionId: section.id, lang },
    orderBy: [{ groupIndex: "asc" }],
  });

  const grouped = {};
  for (const row of rows) {
    grouped[row.groupIndex] ??= {};
    grouped[row.groupIndex][row.fieldKey] = row.value;
  }

  const items = Object.entries(grouped).map(([groupIndex, values]) => ({
    groupIndex: Number(groupIndex),
    values,
  }));

  return res.json({ section, items });
}

// POST /api/professor/sections/:key/data   body: { lang, values: { fieldKey: value } }
// یک آیتم جدید می‌سازد (برای بخش‌های تکرارشونده) — برای بخش تک‌مقداره هم قابل استفاده با groupIndex=0
async function addSectionItem(req, res) {
  const professor = await getOwnProfessor(req.user.userId);
  const section = await getActiveSectionByKey(req.params.key);
  const lang = req.body.lang === "en" ? "en" : "fa";
  const values = req.body.values || {};

  let groupIndex = 0;
  if (section.isRepeatable) {
    const maxRow = await prisma.professorSectionData.aggregate({
      where: { professorId: professor.id, sectionId: section.id, lang },
      _max: { groupIndex: true },
    });
    groupIndex = (maxRow._max.groupIndex ?? -1) + 1;
  }

  const validKeys = new Set(section.fields.map((f) => f.key));
  const rowsToCreate = Object.entries(values)
    .filter(([key]) => validKeys.has(key))
    .map(([fieldKey, value]) => ({
      professorId: professor.id,
      sectionId: section.id,
      groupIndex,
      fieldKey,
      value: String(value ?? ""),
      lang,
    }));

  if (rowsToCreate.length === 0) {
    return res.status(400).json({ message: "هیچ مقدار معتبری ارسال نشده است." });
  }

  await prisma.professorSectionData.createMany({ data: rowsToCreate });
  return res.status(201).json({ groupIndex, values });
}

// PATCH /api/professor/sections/:key/data/:groupIndex  body: { lang, values }
// مقادیر یک آیتم موجود را آپدیت می‌کند (یا اگر فیلدی برای اولین‌بار پر می‌شود، می‌سازد)
async function updateSectionItem(req, res) {
  const professor = await getOwnProfessor(req.user.userId);
  const section = await getActiveSectionByKey(req.params.key);
  const groupIndex = Number(req.params.groupIndex);
  const lang = req.body.lang === "en" ? "en" : "fa";
  const values = req.body.values || {};

  const validKeys = new Set(section.fields.map((f) => f.key));

  // فیلد یکتای ترکیبی (professorId+sectionId+groupIndex+fieldKey+lang) در schema تعریف نشده،
  // پس هر فیلد را دستی پیدا/آپدیت/ایجاد می‌کنیم (برای تعداد کم فیلد در هر بخش کاملاً کافی است)
  for (const [fieldKey, value] of Object.entries(values)) {
    if (!validKeys.has(fieldKey)) continue;
    const existing = await prisma.professorSectionData.findFirst({
      where: { professorId: professor.id, sectionId: section.id, groupIndex, fieldKey, lang },
    });
    if (existing) {
      await prisma.professorSectionData.update({
        where: { id: existing.id },
        data: { value: String(value ?? "") },
      });
    } else {
      await prisma.professorSectionData.create({
        data: {
          professorId: professor.id,
          sectionId: section.id,
          groupIndex,
          fieldKey,
          value: String(value ?? ""),
          lang,
        },
      });
    }
  }

  return res.json({ groupIndex, values });
}

// DELETE /api/professor/sections/:key/data/:groupIndex
async function deleteSectionItem(req, res) {
  const professor = await getOwnProfessor(req.user.userId);
  const section = await getActiveSectionByKey(req.params.key);
  const groupIndex = Number(req.params.groupIndex);

  await prisma.professorSectionData.deleteMany({
    where: { professorId: professor.id, sectionId: section.id, groupIndex },
  });

  return res.status(204).send();
}

module.exports = {
  getProfile,
  updateProfile,
  updateTheme,
  listActiveSections,
  getSectionData,
  addSectionItem,
  updateSectionItem,
  deleteSectionItem,
};
