"use client";

import { useState } from "react";
import { uploadAvatar } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function AvatarUploader({ initialUrl }) {
  const [avatarUrl, setAvatarUrl] = useState(initialUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const res = await uploadAvatar(file);
      if (res.avatarUrl) setAvatarUrl(res.avatarUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="flex items-center gap-3 mb-2.5 pb-2.5 border-b border-gray-200">
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={`${API_URL}${avatarUrl}`} alt="" className="w-11 h-11 rounded-full object-cover" />
      ) : (
        <div className="w-11 h-11 rounded-full bg-navy" />
      )}
      <div className="flex-1 min-w-0">
        <label className="text-xs text-navy cursor-pointer">
          {uploading ? "در حال آپلود..." : "تغییر عکس"}
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} className="hidden" />
        </label>
        {error && <p className="text-[11px] text-red-600">{error}</p>}
      </div>
    </div>
  );
}
