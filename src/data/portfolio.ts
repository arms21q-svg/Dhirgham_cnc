export type ProjectCategory = "doors" | "decor" | "furniture" | "panels" | "signs";

export interface Project {
  id: string;
  titleAr: string;
  titleEn: string;
  category: ProjectCategory;
  image: string;
  featured: boolean;
}

export const projects: Project[] = [
  {
    id: "1",
    titleAr: "باب خشبي فاخر بتصميم هندسي",
    titleEn: "Luxury Geometric Wood Door",
    category: "doors",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    featured: true,
  },
  {
    id: "2",
    titleAr: "لوحة جدارية منقوشة",
    titleEn: "Carved Wall Panel",
    category: "decor",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
    featured: true,
  },
  {
    id: "3",
    titleAr: "طاولة طعام مخصصة",
    titleEn: "Custom Dining Table",
    category: "furniture",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80",
    featured: true,
  },
  {
    id: "4",
    titleAr: "ألواح خشبية بنقوش عربية",
    titleEn: "Arabesque Wood Panels",
    category: "panels",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    featured: true,
  },
  {
    id: "5",
    titleAr: "لافتة خشبية للمحل",
    titleEn: "Shop Wooden Sign",
    category: "signs",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
    featured: true,
  },
  {
    id: "6",
    titleAr: "باب داخلي بتصميم كلاسيكي",
    titleEn: "Classic Interior Door",
    category: "doors",
    image: "https://images.unsplash.com/photo-1600573472592-401b851b7819?w=800&q=80",
    featured: true,
  },
  {
    id: "7",
    titleAr: "ديكور جدار ثلاثي الأبعاد",
    titleEn: "3D Wall Decor",
    category: "decor",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80",
    featured: false,
  },
  {
    id: "8",
    titleAr: "خزانة كتب مخصصة",
    titleEn: "Custom Bookshelf",
    category: "furniture",
    image: "https://images.unsplash.com/photo-1598928506311-c55ded39a2c7?w=800&q=80",
    featured: false,
  },
  {
    id: "9",
    titleAr: "لوحة منقوشة للصالة",
    titleEn: "Living Room Carved Panel",
    category: "panels",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
    featured: false,
  },
];

export function getFeaturedProjects() {
  return projects.filter((p) => p.featured);
}

export function getProjectsByCategory(category: ProjectCategory | "all") {
  if (category === "all") return projects;
  return projects.filter((p) => p.category === category);
}
