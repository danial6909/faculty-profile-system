"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/lib/api";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="text-right px-2.5 py-2 rounded-lg text-sm text-red-600 hover:bg-paper mt-1.5"
    >
      خروج
    </button>
  );
}
