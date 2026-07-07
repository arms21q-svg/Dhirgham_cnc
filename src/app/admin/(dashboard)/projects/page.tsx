import Link from "next/link";
import { getAllProjectsAdmin } from "@/lib/projects-db";
import { ProjectsTable } from "@/components/admin/projects-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function AdminProjectsPage() {
  const projects = await getAllProjectsAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy dark:text-white">إدارة الأعمال</h1>
          <p className="text-muted-foreground">إضافة وتعديل وإظهار/إخفاء الأعمال</p>
        </div>
        <Button render={<Link href="/admin/projects/new" />} className="bg-navy text-white hover:bg-navy-light">
          <Plus className="size-4" />
          إضافة عمل
        </Button>
      </div>
      <ProjectsTable projects={projects} />
    </div>
  );
}
