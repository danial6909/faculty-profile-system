import { redirect } from "next/navigation";
import Link from "next/link";
import { getMeServer } from "@/lib/api";
import LogoutButton from "../logout-button";

export default async function AdminLayout({ children }) {
  const me = await getMeServer();

  // چک نقش سمت سرور — اگر ادمین نیست، اجازه دیدن این بخش را ندارد
  if (!me) redirect("/login");
  if (me.role !== "ADMIN") redirect("/panel/professor");

  return (
    <div className="flex gap-6 items-start flex-wrap">
      <aside className="w-full md:w-52 shrink-0 bg-white border border-gray-200 rounded-xl p-3.5">
        <div className="text-sm text-gray-500 mb-2.5 pb-2.5 border-b border-gray-200">
          <b className="text-ink block text-[0.92rem] mb-0.5">مدیر سیستم</b>
          {me.email}
        </div>
        <nav className="flex flex-col gap-0.5">
          <Link href="/panel/admin/sections" className="px-2.5 py-2 rounded-lg text-sm hover:bg-paper">
            مدیریت بخش‌ها
          </Link>
          <Link href="/panel/admin/professors" className="px-2.5 py-2 rounded-lg text-sm hover:bg-paper">
            لیست اساتید
          </Link>
          <LogoutButton />
        </nav>
      </aside>
      <div className="flex-1 min-w-[260px] bg-white border border-gray-200 rounded-xl p-5">{children}</div>
    </div>
  );
}
