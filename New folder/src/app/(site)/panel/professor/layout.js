import { redirect } from "next/navigation";
import Link from "next/link";
import { getMeServer } from "@/lib/api";
import LogoutButton from "../logout-button";
import AvatarUploader from "./avatar-uploader";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default async function ProfessorLayout({ children }) {
  const me = await getMeServer();

  if (!me) redirect("/login");
  if (me.role !== "PROFESSOR") redirect("/panel/admin");

  const { cookies } = await import("next/headers");
  const token = cookies().get("token")?.value;

  // منوی سایدبار را از روی بخش‌های فعالی که ادمین تعریف کرده می‌سازیم — پویا، نه هاردکد
  const sectionsRes = await fetch(`${API_URL}/api/professor/sections`, {
    headers: { Cookie: `token=${token}` },
    cache: "no-store",
  });
  const sections = sectionsRes.ok ? await sectionsRes.json() : [];

  const profileRes = await fetch(`${API_URL}/api/professor/profile`, {
    headers: { Cookie: `token=${token}` },
    cache: "no-store",
  });
  const profile = profileRes.ok ? await profileRes.json() : null;

  return (
    <div className="flex gap-6 items-start flex-wrap">
      <aside className="w-full md:w-52 shrink-0 bg-white border border-gray-200 rounded-xl p-3.5">
        <AvatarUploader initialUrl={profile?.avatarUrl ?? null} />
        <div className="text-sm text-gray-500 mb-2.5 pb-2.5 border-b border-gray-200">
          <b className="text-ink block text-[0.92rem] mb-0.5">{me.professor?.fullName || me.email}</b>
          پنل استاد
        </div>
        <nav className="flex flex-col gap-0.5">
          {sections.map((s) => (
            <Link
              key={s.key}
              href={`/panel/professor/${s.key}`}
              className="px-2.5 py-2 rounded-lg text-sm hover:bg-paper"
            >
              {s.titleFa}
            </Link>
          ))}
          <Link href="/panel/professor/appearance" className="px-2.5 py-2 rounded-lg text-sm hover:bg-paper">
            ظاهر صفحه
          </Link>
          <a
            href={`/professor/${me.professor?.slug}`}
            target="_blank"
            className="px-2.5 py-2 rounded-lg text-sm text-gold hover:bg-paper"
          >
            مشاهده صفحه عمومی من ↗
          </a>
          <LogoutButton />
        </nav>
      </aside>
      <div className="flex-1 min-w-[260px] bg-white border border-gray-200 rounded-xl p-5">{children}</div>
    </div>
  );
}
