import { ProjectForm } from "@/components/admin/project-form";

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy dark:text-white">إضافة عمل جديد</h1>
        <p className="text-muted-foreground">الحقول بعلامة * مطلوبة، الباقي اختياري</p>
      </div>
      <ProjectForm />
    </div>
  );
}
