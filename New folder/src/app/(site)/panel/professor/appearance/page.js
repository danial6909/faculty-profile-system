"use client";

import { useState } from "react";
import { updateProfessorTheme } from "@/lib/api";

const COLORS = ["#1b2a4a", "#7a3b3b", "#2f6b4f", "#5a4a8a", "#b8894f"];
const FONTS = ["vazirmatn", "yekan", "iransans"];
const FONT_LABELS = {
  vazirmatn: "Vazirmatn (پیش‌فرض)",
  yekan: "یکان",
  iransans: "ایران‌سنس",
};

export default function AppearancePage() {
  const [color, setColor] = useState(COLORS[0]);
  const [font, setFont] = useState(FONTS[0]);
  const [saving, setSaving] = useState(false);
  // const [toast, setToast] = useState<string | null>(null);

  // async function handleSave() {
  //   setSaving(true);
  //   try {
  //     await updateProfessorTheme(color, font);
  //     setToast("تنظیمات ظاهری ذخیره شد.");
  //     setTimeout(() => setToast(null), 1800);
  //   } finally {
  //     setSaving(false);
  //   }
  // }

  return (
    <div>
      <h3 className="text-lg font-bold mb-1">ظاهر صفحه</h3>
      <p className="text-gray-500 text-sm mb-5">
        رنگ و فونت صفحه عمومی خودتان را از میان گزینه‌های مجاز انتخاب کنید.
      </p>

      <div className="mb-5">
        <label className="block text-sm text-gray-500 mb-2">رنگ اصلی صفحه</label>
        <div className="flex gap-2.5 flex-wrap">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className="w-8 h-8 rounded-full"
              style={{
                backgroundColor: c,
                outline: color === c ? "2px solid #22262e" : "none",
                outlineOffset: 2,
              }}
              aria-label={c}
            />
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm text-gray-500 mb-2">فونت</label>
        <div className="flex gap-2.5 flex-wrap">
          {FONTS.map((f) => (
            <button
              key={f}
              onClick={() => setFont(f)}
              className={`text-sm px-3.5 py-2 rounded-lg border ${
                font === f ? "border-navy bg-paper font-semibold" : "border-gray-200"
              }`}
            >
              {FONT_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      <button
        // onClick={handleSave}
        disabled={saving}
        className="bg-navy text-white text-sm font-semibold rounded-lg px-5 py-2.5 disabled:opacity-60"
      >
        {saving ? "در حال ذخیره..." : "ذخیره تنظیمات ظاهری"}
      </button>

      {/* {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-navy text-white text-sm px-5 py-2.5 rounded-full">
          {toast}
        </div>
      )} */}
    </div>
  );
}
