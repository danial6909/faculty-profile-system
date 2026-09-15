"use client";

import { useEffect, useState } from "react";
import {
  getAdminSections,
  createAdminSection,
  toggleAdminSection,
  deleteAdminSection,
} from "@/lib/api";

export default function AdminSectionsPage() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newTitleFa, setNewTitleFa] = useState("");
  const [newTitleEn, setNewTitleEn] = useState("");
  const [newRepeatable, setNewRepeatable] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setSections(await getAdminSections());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!newTitleFa.trim() || !newTitleEn.trim()) return;
    setSaving(true);
    try {
      // کلید یکتا از روی عنوان انگلیسی ساخته می‌شود (ساده‌سازی‌شده برای نمونه)
      const key = newTitleEn.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
      await createAdminSection({
        key: `${key}-${Date.now().toString().slice(-4)}`,
        titleFa: newTitleFa.trim(),
        titleEn: newTitleEn.trim(),
        isRepeatable: newRepeatable,
      });
      setNewTitleFa("");
      setNewTitleEn("");
      setNewRepeatable(false);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(section) {
    await toggleAdminSection(section.id, !section.isActive);
    await load();
  }

  async function handleDelete(section) {
    if (!confirm(`بخش «${section.titleFa}» حذف شود؟ این کار قابل بازگشت نیست.`)) return;
    await deleteAdminSection(section.id);
    await load();
  }

  return (
    <div>
      <h3 className="text-lg font-bold mb-1">مدیریت بخش‌ها</h3>
      <p className="text-gray-500 text-sm mb-4">
        این بخش‌ها همان‌هایی هستند که در پنل استاد و صفحه عمومی نمایش داده می‌شوند.
      </p>

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      {loading ? (
        <p className="text-gray-400 text-sm">در حال بارگذاری...</p>
      ) : (
        <table className="w-full text-sm border-collapse mb-6">
          <thead>
            <tr className="text-gray-500">
              <th className="text-right py-2 border-b border-gray-200 font-medium">عنوان</th>
              <th className="text-right py-2 border-b border-gray-200 font-medium">نوع</th>
              <th className="text-right py-2 border-b border-gray-200 font-medium">وضعیت</th>
              <th className="border-b border-gray-200"></th>
            </tr>
          </thead>
          <tbody>
            {sections.map((s) => (
              <tr key={s.id}>
                <td className="py-2 border-b border-gray-100">{s.titleFa}</td>
                <td className="py-2 border-b border-gray-100 text-gray-500">
                  {s.isRepeatable ? "تکرارشونده" : "تک‌مقداره"}
                </td>
                <td className="py-2 border-b border-gray-100">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full ${
                      s.isActive ? "bg-paper text-navy" : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {s.isActive ? "فعال" : "غیرفعال"}
                  </span>
                </td>
                <td className="py-2 border-b border-gray-100 text-left space-x-2 space-x-reverse">
                  <button
                    onClick={() => handleToggle(s)}
                    className="text-xs border border-navy text-navy rounded-lg px-2.5 py-1 hover:bg-paper"
                  >
                    {s.isActive ? "غیرفعال کن" : "فعال کن"}
                  </button>
                  <button onClick={() => handleDelete(s)} className="text-xs text-red-600 hover:underline">
                    حذف
                  </button>
                </td>
              </tr>
            ))}
            {sections.length === 0 && (
              <tr>
                <td colSpan={4} className="py-4 text-center text-gray-400">
                  هنوز بخشی ساخته نشده.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <form onSubmit={handleCreate} className="border-t border-gray-200 pt-4">
        <p className="text-sm font-semibold mb-2.5">افزودن بخش جدید</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <input
            value={newTitleFa}
            onChange={(e) => setNewTitleFa(e.target.value)}
            placeholder="عنوان فارسی (مثلا افتخارات)"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-paper"
          />
          <input
            value={newTitleEn}
            onChange={(e) => setNewTitleEn(e.target.value)}
            placeholder="Title in English"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-paper"
          />
        </div>
        <label className="flex items-center gap-2 text-sm mb-3">
          <input type="checkbox" checked={newRepeatable} onChange={(e) => setNewRepeatable(e.target.checked)} />
          تکرارشونده باشد (مثل سوابق تحصیلی، چند آیتم قابل افزودن)
        </label>
        <button
          type="submit"
          disabled={saving}
          className="bg-navy text-white text-sm font-semibold rounded-lg px-4 py-2 disabled:opacity-60"
        >
          {saving ? "در حال ذخیره..." : "+ افزودن بخش"}
        </button>
        <p className="text-xs text-gray-400 mt-2">
          نکته: در این نسخه نمونه، افزودن فیلد به بخش (SectionField) از طریق UI پیاده نشده — با
          الگوی همین کنترلر در بک‌اند (`admin.controller.js`) قابل اضافه‌شدن است.
        </p>
      </form>
    </div>
  );
}
