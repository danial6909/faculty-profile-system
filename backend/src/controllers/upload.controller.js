const prisma = require("../config/db");

// POST /api/professor/avatar   (form-data, field name: "avatar")
// عکس را ذخیره کرده و مستقیم روی پروفایل خود استاد ست می‌کند
async function uploadAvatar(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: "فایلی ارسال نشده است." });
  }

  const professor = await prisma.professor.findUnique({ where: { userId: req.user.userId } });
  if (!professor) {
    return res.status(404).json({ message: "حساب استاد یافت نشد." });
  }

  const url = `/uploads/${req.file.filename}`;

  const updated = await prisma.professor.update({
    where: { id: professor.id },
    data: { avatarUrl: url },
  });

  return res.json({ avatarUrl: updated.avatarUrl });
}

// POST /api/professor/upload-image   (form-data, field name: "image")
// آپلود عمومی — برای فیلدهایی با نوع IMAGE داخل بخش‌های پویا
// فقط لینک فایل را برمی‌گرداند؛ ذخیره در ProfessorSectionData با همان
// اندپوینت‌های معمولی add/update انجام می‌شود (value = این لینک)
async function uploadGenericImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: "فایلی ارسال نشده است." });
  }
  const url = `/uploads/${req.file.filename}`;
  return res.status(201).json({ url });
}

module.exports = { uploadAvatar, uploadGenericImage };
