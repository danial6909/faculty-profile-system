"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link2, Check } from "lucide-react";
import Button from "../ui/button";

export default function CopyLinkButton({ tone = "light" }) {
  const t = useTranslations("ProfileHero");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // no-op — clipboard API might be unavailable (e.g. insecure context)
    }
  };

  if (tone === "dark") {
    return (
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-primary-100 transition-colors hover:bg-white/10"
      >
        {copied ? <Check className="size-3.5" /> : <Link2 className="size-3.5" />}
        {copied ? t("copyLinkDone") : t("copyLink")}
      </button>
    );
  }

  return (
    <Button type="button" variant="outlined" size="sm" onClick={handleCopy}>
      {copied ? <Check className="size-3.5" /> : <Link2 className="size-3.5" />}
      {copied ? t("copyLinkDone") : t("copyLink")}
    </Button>
  );
}