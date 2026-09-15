"use client";

import { useState } from "react";

export default function ProfileTabs({ tabs }) {
  const [activeId, setActiveId] = useState(tabs[0]?.id);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-1 rounded-full border border-neutral-200 bg-white p-1.5 shadow-card sm:inline-flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveId(tab.id)}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-colors sm:text-sm ${
              tab.id === activeId
                ? "bg-neutral-900 text-white"
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            {tab.icon}
            {tab.label}
            {tab.count && (
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                  tab.id === activeId ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-500"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* هر تب همیشه در DOM رندر می‌شه (فقط با CSS مخفی/نمایان می‌شه)، نه
          conditional mount/unmount — هم برای این‌که موتورهای جست‌وجو کل
          محتوا رو ببینن، هم برای حفظ state تب‌های دیگه (مثل فرم تماس). */}
      {tabs.map((tab) => (
        <div key={tab.id} className={tab.id === activeId ? "" : "hidden"}>
          {tab.content}
        </div>
      ))}
    </div>
  );
}