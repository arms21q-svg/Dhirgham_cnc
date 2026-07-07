import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/projects-db";
import { ProjectForm } from "@/components/admin/project-form";

type Props = { params: Promise<{ id: string }> };

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy dark:text-white">تعديل العمل</h1>
        <p className="text-muted-foreground">{project.titleAr}</p>
      </div>
      <ProjectForm
        projectId={project.id}
        initial={{
          titleAr: project.titleAr,
          titleEn: project.titleEn,
          descriptionAr: project.descriptionAr ?? "",
          descriptionEn: project.descriptionEn ?? "",
          category: project.category,
          imageUrl: project.imageUrl,
          featured: project.featured,
          published: project.published,
          order: project.order,
        }}
      />
    </div>
  );
}
