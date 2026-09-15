"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send } from "lucide-react";
import Button from "../ui/button";

export default function ContactMessageForm({ professorName }) {
  const t = useTranslations("ContactForm");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: اتصال به API واقعی برای ارسال پیام به استاد (src/lib/api.js)
    setSent(true);
  };

  if (sent) {
    return (
      <p className="rounded-xl bg-secondary-50 p-4 text-center text-sm text-secondary-700">
        {t("sent", { name: professorName })}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        <input
          required
          type="text"
          placeholder={t("namePlaceholder")}
          className="col-span-2 rounded-lg border border-neutral-200 px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:col-span-1"
        />
        <input
          required
          type="email"
          placeholder={t("emailPlaceholder")}
          className="col-span-2 rounded-lg border border-neutral-200 px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:col-span-1"
        />
      </div>
      <input
        required
        type="text"
        placeholder={t("subjectPlaceholder")}
        className="rounded-lg border border-neutral-200 px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      />
      <textarea
        required
        rows={3}
        placeholder={t("messagePlaceholder")}
        className="resize-none rounded-lg border border-neutral-200 px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      />
      <Button type="submit" variant="primary" size="sm" className="w-full">
        <Send className="size-3.5" />
        {t("submit")}
      </Button>
    </form>
  );
}
