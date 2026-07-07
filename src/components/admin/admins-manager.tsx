"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Admin = {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
};

const emptyForm = { name: "", email: "", password: "", role: "admin" };

type AdminsManagerProps = {
  initialAdmins: Admin[];
};

export function AdminsManager({ initialAdmins }: AdminsManagerProps) {
  const router = useRouter();
  const [admins, setAdmins] = useState<Admin[]>(initialAdmins);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function resetForm() {
    setForm(emptyForm);
    setShowPassword(false);
    setError("");
  }

  function handleDialogChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) resetForm();
  }

  async function loadAdmins() {
    const res = await fetch("/api/admin/admins");
    if (!res.ok) return;
    const data = await res.json();
    setAdmins(data.admins ?? []);
  }

  async function createAdmin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const d = await res.json();
      setError(
        d.error === "Email already exists"
          ? "البريد مستخدم مسبقاً"
          : d.error === "Invalid input"
            ? "تحقق من البيانات المدخلة"
            : "حدث خطأ"
      );
      setLoading(false);
      return;
    }

    handleDialogChange(false);
    await loadAdmins();
    setLoading(false);
    router.refresh();
  }

  async function toggleActive(id: string, active: boolean) {
    await fetch(`/api/admin/admins/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    await loadAdmins();
  }

  async function deleteAdmin(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا المسؤول؟")) return;
    await fetch(`/api/admin/admins/${id}`, { method: "DELETE" });
    await loadAdmins();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white">إدارة المسؤولين</h1>
          <p className="text-muted-foreground">إضافة وإدارة حسابات لوحة التحكم</p>
        </div>
        <Dialog open={open} onOpenChange={handleDialogChange}>
          <DialogTrigger render={<Button className="bg-navy text-white hover:bg-navy-light" />}>
            <UserPlus className="size-4" />
            إضافة مسؤول
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>إضافة مسؤول جديد</DialogTitle>
            </DialogHeader>
            <form onSubmit={createAdmin} className="space-y-4" autoComplete="off">
              <div>
                <Label htmlFor="name">الاسم</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  autoComplete="off"
                  required
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="adminEmail">البريد</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  autoComplete="off"
                  required
                  dir="ltr"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="adminPassword">كلمة المرور</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="adminPassword"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    dir="ltr"
                    className="pe-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute end-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  لن تُخزَّن كلمة المرور بشكل واضح — تُشفَّر فوراً عند الحفظ.
                </p>
              </div>
              <div>
                <Label htmlFor="role">الصلاحية</Label>
                <select
                  id="role"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="mt-1.5 flex h-8 w-full rounded-lg border border-input px-2.5 text-sm"
                >
                  <option value="admin">مسؤول</option>
                  <option value="super_admin">مسؤول رئيسي</option>
                </select>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "جاري الإضافة..." : "إضافة"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة المسؤولين</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>البريد</TableHead>
                <TableHead>الصلاحية</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.name}</TableCell>
                  <TableCell dir="ltr">{a.email}</TableCell>
                  <TableCell>
                    <Badge variant={a.role === "super_admin" ? "default" : "secondary"}>
                      {a.role === "super_admin" ? "رئيسي" : "مسؤول"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => toggleActive(a.id, a.active)}
                      className={`text-xs font-medium ${a.active ? "text-green-600" : "text-muted-foreground"}`}
                    >
                      {a.active ? "نشط" : "معطل"}
                    </button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => deleteAdmin(a.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
