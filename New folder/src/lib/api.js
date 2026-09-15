// یک نقطه واحد برای همه درخواست‌ها به بک‌اند
// همه‌ی fetchهای پروژه باید از این تابع رد بشن، نه fetch مستقیم پخش‌شده توی کامپوننت‌ها

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include", // برای ارسال کوکی httpOnly (لاگین)
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    // در سرور Next.js کش نشه تا همیشه دیتای تازه بگیریم (فاز توسعه)
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `خطا در ارتباط با سرور (${res.status})`);
  }

  // برای پاسخ‌های ۲۰۴ بدون بدنه
  if (res.status === 204) return undefined;

  return res.json();
}

export function getProfessors() {
  return apiFetch("/api/public/professors");
}

export function getProfessorBySlug(slug, lang = "fa") {
  return apiFetch(`/api/public/professors/${slug}?lang=${lang}`);
}

export function login(email, password) {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// نسخه‌ی سرور: در layout/page های Server Component، fetch مرورگر کوکی را
// خودکار نمی‌فرستد؛ باید دستی از next/headers بخوانیم و پاس بدهیم.
export async function getMeServer() {
  const { cookies } = await import("next/headers");
  const token = cookies().get("token")?.value;
  if (!token) return null;

  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: { Cookie: `token=${token}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export function getMe() {
  return apiFetch("/api/auth/me");
}

export function logout() {
  return apiFetch("/api/auth/logout", { method: "POST" });
}

// ---------- پنل ادمین ----------

export function getAdminSections() {
  return apiFetch("/api/admin/sections");
}

export function createAdminSection(data) {
  return apiFetch("/api/admin/sections", { method: "POST", body: JSON.stringify(data) });
}

export function toggleAdminSection(id, isActive) {
  return apiFetch(`/api/admin/sections/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  });
}

export function deleteAdminSection(id) {
  return apiFetch(`/api/admin/sections/${id}`, { method: "DELETE" });
}

export function getAdminProfessors() {
  return apiFetch("/api/admin/professors");
}

export function toggleAdminProfessor(id, isActive) {
  return apiFetch(`/api/admin/professors/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  });
}

// ---------- پنل استاد ----------

export function getProfessorSections() {
  return apiFetch("/api/professor/sections");
}

export function getProfessorSectionData(key) {
  return apiFetch(`/api/professor/sections/${key}/data`);
}

export function addProfessorSectionItem(key, values) {
  return apiFetch(`/api/professor/sections/${key}/data`, {
    method: "POST",
    body: JSON.stringify({ lang: "fa", values }),
  });
}

export function updateProfessorSectionItem(key, groupIndex, values) {
  return apiFetch(`/api/professor/sections/${key}/data/${groupIndex}`, {
    method: "PATCH",
    body: JSON.stringify({ lang: "fa", values }),
  });
}

export function deleteProfessorSectionItem(key, groupIndex) {
  return apiFetch(`/api/professor/sections/${key}/data/${groupIndex}`, { method: "DELETE" });
}

export function updateProfessorTheme(themeColor, themeFont) {
  return apiFetch("/api/professor/theme", {
    method: "PATCH",
    body: JSON.stringify({ themeColor, themeFont }),
  });
}

// آپلود فایل — multipart/form-data، پس نمی‌تواند از apiFetch (که Content-Type: json می‌فرستد) استفاده کند
async function uploadFile(path, fieldName, file) {
  const formData = new FormData();
  formData.append(fieldName, file);

  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || "خطا در آپلود فایل.");
  }
  return res.json();
}

export function uploadAvatar(file) {
  return uploadFile("/api/professor/avatar", "avatar", file);
}

export function uploadSectionImage(file) {
  return uploadFile("/api/professor/upload-image", "image", file);
}
