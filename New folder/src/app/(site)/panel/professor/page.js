import { redirect } from "next/navigation";
import { getProfessorSections } from "@/lib/api";

export default async function ProfessorIndexPage() {
  try {
    const sections = await getProfessorSections();
    if (sections.length > 0) redirect(`/panel/professor/${sections[0].key}`);
  } catch {
    // اگر بک‌اند در دسترس نبود، به تنظیمات ظاهری می‌رویم که فچ سنگین ندارد
  }
  redirect("/panel/professor/appearance");
}
