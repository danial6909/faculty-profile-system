"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getProfessorSectionData,
  addProfessorSectionItem,
  updateProfessorSectionItem,
  deleteProfessorSectionItem,
  uploadSectionImage,
} from "@/lib/api";

export default function SectionEditorPage() {
  const params = useParams();
  const sectionKey = params.sectionKey;

  const [section, setSection] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [savingIndex, setSavingIndex] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const res = await getProfessorSectionData(sectionKey);
      setSection(res.section);
      // بخش تک‌مقداره: همیشه حداقل یک آیتم (خالی) برای فرم نشان بده
      if (!res.section.isRepeatable && res.items.length === 0) {
        setItems([{ groupIndex: 0, values: {} }]);
      } else {
        setItems(res.items);
      }
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionKey]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  }

  function updateLocalValue(groupIndex, fieldKey, value) {
    setItems((prev) =>
      prev.map((it) => (it.groupIndex === groupIndex ? { ...it, values: { ...it.values, [fieldKey]: value } } : it))
    );
  }

  async function handleAddItem() {
    setItems((prev) => [...prev, { groupIndex: -1 - prev.length, values: {} }]); // groupIndex موقت منفی تا واقعاً ذخیره شود
  }

  async function handleSaveItem(item) {
    if (!section) return;
    setSavingIndex(item.groupIndex);
    try {
      if (item.groupIndex < 0) {
        await addProfessorSectionItem(sectionKey, item.values);
      } else {
        await updateProfessorSectionItem(sectionKey, item.groupIndex, item.values);
      }
      showToast("ذخیره شد.");
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingIndex(null);
    }
  }

  async function handleDeleteItem(item) {
    if (item.groupIndex < 0) {
      // هنوز در دیتابیس ذخیره نشده، فقط از UI حذفش کن
      setItems((prev) => prev.filter((it) => it.groupIndex !== item.groupIndex));
      return;
    }
    if (!confirm("این آیتم حذف شود؟")) return;
    await deleteProfessorSectionItem(sectionKey, item.groupIndex);
    await load();
  }

  if (loading) return <p className="text-gray-400 text-sm">در حال بارگذاری...</p>;
  if (error) return <p className="text-red-600 text-sm">{error}</p>;
  if (!section) return null;

  return (
    <div>
      <h3 className="text-lg font-bold mb-1">{section.titleFa}</h3>
      <p className="text-gray-500 text-sm mb-5">
        {section.isRepeatable ? "هر تعداد آیتم که مایل هستید اضافه کنید." : "این بخش یک‌بار پر می‌شود."}
      </p>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.groupIndex} className="border border-dashed border-gray-300 rounded-lg p-4 relative">
            {section.isRepeatable && (
              <button
                onClick={() => handleDeleteItem(item)}
                className="absolute left-3 top-3 text-red-500 text-xs"
              >
                حذف ✕
              </button>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {section.fields.map((field) => (
                <div key={field.key} className={field.fieldType === "TEXTAREA" ? "sm:col-span-2" : ""}>
                  <label className="block text-xs text-gray-500 mb-1.5">{field.labelFa}</label>
                  <FieldInput
                    type={field.fieldType}
                    value={item.values[field.key] || ""}
                    onChange={(v) => updateLocalValue(item.groupIndex, field.key, v)}
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() => handleSaveItem(item)}
              disabled={savingIndex === item.groupIndex}
              className="mt-3 bg-navy text-white text-xs font-semibold rounded-lg px-4 py-2 disabled:opacity-60"
            >
              {savingIndex === item.groupIndex ? "در حال ذخیره..." : "ذخیره این مورد"}
            </button>
          </div>
        ))}
      </div>

      {section.isRepeatable && (
        <button
          onClick={handleAddItem}
          className="mt-4 border border-navy text-navy text-sm rounded-lg px-4 py-2 hover:bg-paper"
        >
          + افزودن مورد جدید
        </button>
      )}

      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-navy text-white text-sm px-5 py-2.5 rounded-full">
          {toast}
        </div>
      )}
    </div>
  );
}

function FieldInput({ type, value, onChange }) {
  const baseClass = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-paper";

  if (type === "TEXTAREA") {
    return <textarea rows={4} className={baseClass} value={value} onChange={(e) => onChange(e.target.value)} />;
  }
  if (type === "DATE") {
    return <input type="date" className={baseClass} value={value} onChange={(e) => onChange(e.target.value)} />;
  }
  if (type === "LINK") {
    return (
      <input
        type="url"
        placeholder="https://"
        className={baseClass}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  if (type === "IMAGE") {
    return <ImageFieldInput value={value} onChange={onChange} />;
  }
  return <input type="text" className={baseClass} value={value} onChange={(e) => onChange(e.target.value)} />;
}

function ImageFieldInput({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const { url } = await uploadSectionImage(file);
      if (url) onChange(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = ""; // اجازه انتخاب دوباره همان فایل
    }
  }

  return (
    <div>
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}${value}`}
          alt=""
          className="w-20 h-20 rounded-lg object-cover mb-2 border border-gray-200"
        />
      )}
      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} className="text-xs" />
      {uploading && <p className="text-xs text-gray-400 mt-1">در حال آپلود...</p>}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
