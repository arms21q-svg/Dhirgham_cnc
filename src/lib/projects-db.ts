import { unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { projects as fallbackProjects, type ProjectCategory } from "@/data/portfolio";

export type ProjectRecord = {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string | null;
  descriptionEn: string | null;
  category: ProjectCategory;
  imageUrl: string;
  featured: boolean;
  order: number;
  published: boolean;
};

export type ProjectInput = {
  titleAr: string;
  titleEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  category: ProjectCategory;
  imageUrl: string;
  featured?: boolean;
  order?: number;
  published?: boolean;
};

function getFallbackProjects(): ProjectRecord[] {
  return fallbackProjects.map((project, index) => ({
    id: project.id,
    titleAr: project.titleAr,
    titleEn: project.titleEn,
    descriptionAr: null,
    descriptionEn: null,
    category: project.category,
    imageUrl: project.image,
    featured: project.featured,
    order: index,
    published: true,
  }));
}

async function fetchPublishedProjects() {
  try {
    const rows = await prisma.project.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return rows.length > 0 ? rows : getFallbackProjects();
  } catch {
    return getFallbackProjects();
  }
}

async function fetchFeaturedProjects() {
  try {
    const rows = await prisma.project.findMany({
      where: { published: true, featured: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return rows.length > 0
      ? rows
      : getFallbackProjects().filter((project) => project.featured);
  } catch {
    return getFallbackProjects().filter((project) => project.featured);
  }
}

const getCachedPublishedProjects = unstable_cache(
  fetchPublishedProjects,
  ["published-projects"],
  { revalidate: 120, tags: ["projects"] }
);

const getCachedFeaturedProjects = unstable_cache(
  fetchFeaturedProjects,
  ["featured-projects"],
  { revalidate: 120, tags: ["projects"] }
);

export async function getPublishedProjects() {
  return getCachedPublishedProjects();
}

export async function getActiveProjectCategories(): Promise<ProjectCategory[]> {
  const projects = await getPublishedProjects();
  return [...new Set(projects.map((p) => p.category as ProjectCategory))];
}

export async function getFeaturedProjects() {
  return getCachedFeaturedProjects();
}

export async function getProjectsByCategory(category: ProjectCategory | "all") {
  const projects = await getPublishedProjects();
  if (category === "all") return projects;
  return projects.filter((p) => p.category === category);
}

export async function getAllProjectsAdmin() {
  try {
    return await prisma.project.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
  } catch {
    return getFallbackProjects();
  }
}

export async function getProjectById(id: string) {
  try {
    return await prisma.project.findUnique({ where: { id } });
  } catch {
    return getFallbackProjects().find((project) => project.id === id) ?? null;
  }
}

export function revalidateProjectsCache() {
  revalidateTag("projects", "max");
}

export async function createProject(data: ProjectInput) {
  const project = await prisma.project.create({
    data: {
      titleAr: data.titleAr,
      titleEn: data.titleEn,
      descriptionAr: data.descriptionAr || null,
      descriptionEn: data.descriptionEn || null,
      category: data.category,
      imageUrl: data.imageUrl,
      featured: data.featured ?? false,
      order: data.order ?? 0,
      published: data.published ?? true,
    },
  });
  revalidateProjectsCache();
  return project;
}

export async function updateProject(id: string, data: Partial<ProjectInput>) {
  const project = await prisma.project.update({
    where: { id },
    data: {
      ...(data.titleAr !== undefined && { titleAr: data.titleAr }),
      ...(data.titleEn !== undefined && { titleEn: data.titleEn }),
      ...(data.descriptionAr !== undefined && {
        descriptionAr: data.descriptionAr || null,
      }),
      ...(data.descriptionEn !== undefined && {
        descriptionEn: data.descriptionEn || null,
      }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
      ...(data.featured !== undefined && { featured: data.featured }),
      ...(data.order !== undefined && { order: data.order }),
      ...(data.published !== undefined && { published: data.published }),
    },
  });
  revalidateProjectsCache();
  return project;
}

export async function deleteProject(id: string) {
  const project = await prisma.project.delete({ where: { id } });
  revalidateProjectsCache();
  return project;
}

export function toPublicProject(p: {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr?: string | null;
  descriptionEn?: string | null;
  category: string;
  imageUrl: string;
  featured: boolean;
}) {
  return {
    id: p.id,
    titleAr: p.titleAr,
    titleEn: p.titleEn,
    descriptionAr: p.descriptionAr ?? null,
    descriptionEn: p.descriptionEn ?? null,
    category: p.category as ProjectCategory,
    image: p.imageUrl,
    featured: p.featured,
  };
}
