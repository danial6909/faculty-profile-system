const prisma = require("../config/db");

// GET /api/admin/sections
async function listSections(req, res) {
  const sections = await prisma.section.findMany({
    include: { fields: { orderBy: { order: "asc" } } },
    orderBy: { order: "asc" },
  });
  return res.json(sections);
}

// POST /api/admin/sections
// body: { key, titleFa, titleEn, isRepeatable }
async function createSection(req, res) {
  const { key, titleFa, titleEn, isRepeatable } = req.body;

  if (!key || !titleFa || !titleEn) {
    return res.status(400).json({ message: "کلید و عنوان فارسی/انگلیسی الزامی است." });
  }

  const maxOrder = await prisma.section.aggregate({ _max: { order: true } });

  const section = await prisma.section.create({
    data: {
      key,
      titleFa,
      titleEn,
      isRepeatable: Boolean(isRepeatable),
      order: (maxOrder._max.order ?? 0) + 1,
    },
  });

  return res.status(201).json(section);
}

// PATCH /api/admin/sections/:id
// body: { titleFa?, titleEn?, isActive?, order? }
async function updateSection(req, res) {
  const { id } = req.params;
  const { titleFa, titleEn, isActive, order } = req.body;

  const section = await prisma.section.update({
    where: { id: Number(id) },
    data: { titleFa, titleEn, isActive, order },
  });

  return res.json(section);
}

// DELETE /api/admin/sections/:id
async function deleteSection(req, res) {
  const { id } = req.params;
  await prisma.section.delete({ where: { id: Number(id) } });
  return res.status(204).send();
}

// GET /api/admin/professors — لیست همه اساتید (برای صفحه مدیریت اساتید در پنل ادمین)
async function listProfessorsAdmin(req, res) {
  const professors = await prisma.professor.findMany({
    select: {
      id: true,
      slug: true,
      fullName: true,
      department: true,
      academicRank: true,
      isActive: true,
      user: { select: { email: true } },
    },
    orderBy: { fullName: "asc" },
  });
  return res.json(professors);
}

// PATCH /api/admin/professors/:id/status   body: { isActive }
async function updateProfessorStatus(req, res) {
  const { id } = req.params;
  const { isActive } = req.body;
  const professor = await prisma.professor.update({
    where: { id: Number(id) },
    data: { isActive: Boolean(isActive) },
  });
  return res.json(professor);
}

module.exports = {
  listSections,
  createSection,
  updateSection,
  deleteSection,
  listProfessorsAdmin,
  updateProfessorStatus,
};
