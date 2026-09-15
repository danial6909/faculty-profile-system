"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { user } = await login(email, password);
      // بر اساس نقش کاربر به بخش مربوطه هدایت می‌شود
      router.push(user.role === "ADMIN" ? "/panel/admin" : "/panel/professor");
    } catch (err) {
      setError(err.message || "ورود ناموفق بود.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-10 bg-white border border-gray-200 rounded-xl p-7">
      <h2 className="text-lg font-bold mb-1">ورود به پنل</h2>
      <p className="text-gray-500 text-sm mb-5">با ایمیل و رمز عبور خود وارد شوید.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-500 mb-1.5">ایمیل</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-paper"
            placeholder="admin@university.ac.ir"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1.5">رمز عبور</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-paper"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-navy text-white text-sm font-semibold rounded-lg px-5 py-2.5 disabled:opacity-60"
        >
          {loading ? "در حال ورود..." : "ورود"}
        </button>
      </form>

      <p className="text-xs text-gray-400 mt-5">
        برای تست: admin@university.ac.ir / Admin@123 یا sadeghizadeh@university.ac.ir / Prof@123
        (از seed بک‌اند)
      </p>
    </div>
  );
}
