"use client";

import { useEffect, useState } from "react";
import { getAdminProfessors, toggleAdminProfessor } from "@/lib/api";

export default function AdminProfessorsPage() {
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    try {
      setProfessors(await getAdminProfessors());
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

  async function handleToggle(p) {
    await toggleAdminProfessor(p.id, !p.isActive);
    await load();
  }

  return (
    <div>
      <h3 className="text-lg font-bold mb-1">لیست اساتید</h3>
      <p className="text-gray-500 text-sm mb-4">
        غیرفعال‌کردن یک استاد، پروفایلش را از سایت عمومی مخفی می‌کند (حذف نمی‌شود).
      </p>

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      {loading ? (
        <p className="text-gray-400 text-sm">در حال بارگذاری...</p>
      ) : (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-gray-500">
              <th className="text-right py-2 border-b border-gray-200 font-medium">نام</th>
              <th className="text-right py-2 border-b border-gray-200 font-medium">گروه آموزشی</th>
              <th className="text-right py-2 border-b border-gray-200 font-medium">ایمیل</th>
              <th className="text-right py-2 border-b border-gray-200 font-medium">وضعیت</th>
              <th className="border-b border-gray-200"></th>
            </tr>
          </thead>
          <tbody>
            {professors.map((p) => (
              <tr key={p.id}>
                <td className="py-2 border-b border-gray-100">{p.fullName}</td>
                <td className="py-2 border-b border-gray-100 text-gray-500">{p.department}</td>
                <td className="py-2 border-b border-gray-100 text-gray-500">{p.user.email}</td>
                <td className="py-2 border-b border-gray-100">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full ${
                      p.isActive ? "bg-paper text-navy" : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {p.isActive ? "فعال" : "غیرفعال"}
                  </span>
                </td>
                <td className="py-2 border-b border-gray-100 text-left">
                  <button
                    onClick={() => handleToggle(p)}
                    className="text-xs border border-navy text-navy rounded-lg px-2.5 py-1 hover:bg-paper"
                  >
                    {p.isActive ? "غیرفعال کن" : "فعال کن"}
                  </button>
                </td>
              </tr>
            ))}
            {professors.length === 0 && (
              <tr>
                <td colSpan={5} className="py-4 text-center text-gray-400">
                  هنوز استادی ثبت نشده.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
