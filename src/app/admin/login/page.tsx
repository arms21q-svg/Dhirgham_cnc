import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { LoginForm } from "@/components/admin/login-form";
import { cairo } from "@/lib/fonts";
import "@/app/globals.css";

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();
  if (admin) redirect("/admin");

  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="flex min-h-screen items-center justify-center bg-navy p-4 font-[family-name:var(--font-cairo)] antialiased">
        <LoginForm />
      </body>
    </html>
  );
}
