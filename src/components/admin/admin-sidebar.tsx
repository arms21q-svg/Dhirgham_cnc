"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Image,
  Settings,
  Users,
  LogOut,
  ExternalLink,
  HelpCircle,
  Mail,
  FileText,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/admin/homepage", label: "الصفحة الرئيسية", icon: Home },
  { href: "/admin/projects", label: "الأعمال", icon: Image },
  { href: "/admin/quotes", label: "عروض الأسعار", icon: FileText },
  { href: "/admin/messages", label: "الرسائل", icon: Mail },
  { href: "/admin/faq", label: "الأسئلة الشائعة", icon: HelpCircle },
  { href: "/admin/settings", label: "إعدادات الموقع", icon: Settings },
  { href: "/admin/admins", label: "المسؤولون", icon: Users, superOnly: true },
];

export function AdminSidebar({
  admin,
}: {
  admin: { name: string; email: string; role: string };
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col border-e border-border/50 bg-navy text-white dark:bg-navy-dark">
      <div className="border-b border-white/10 p-5">
        <p className="text-sm font-bold text-gold">ضرغام CNC</p>
        <p className="mt-1 text-xs text-white/60">لوحة التحكم</p>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {links
          .filter((l) => !l.superOnly || admin.role === "super_admin")
          .map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                pathname === href || (href !== "/admin" && pathname.startsWith(href))
                  ? "bg-gold/15 text-gold"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
      </nav>

      <div className="border-t border-white/10 p-4 space-y-3">
        <div className="text-xs text-white/50">
          <p className="font-medium text-white/80">{admin.name}</p>
          <p dir="ltr" className="truncate">{admin.email}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            render={<Link href="/" target="_blank" />}
            className="flex-1 text-white/70 hover:text-gold hover:bg-white/5"
          >
            <ExternalLink className="size-3.5" />
            الموقع
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-white/70 hover:text-red-400 hover:bg-white/5"
          >
            <LogOut className="size-3.5" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
