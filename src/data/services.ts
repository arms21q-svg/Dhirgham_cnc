import {
  DoorOpen,
  Frame,
  Sofa,
  Grid3x3,
  Signpost,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { ProjectCategory } from "@/data/portfolio";

export interface ServiceItem {
  id: string;
  icon: LucideIcon;
  titleKey: string;
  descriptionKey: string;
}

export const services: ServiceItem[] = [
  {
    id: "doors",
    icon: DoorOpen,
    titleKey: "services.items.doors.title",
    descriptionKey: "services.items.doors.description",
  },
  {
    id: "decor",
    icon: Frame,
    titleKey: "services.items.decor.title",
    descriptionKey: "services.items.decor.description",
  },
  {
    id: "furniture",
    icon: Sofa,
    titleKey: "services.items.furniture.title",
    descriptionKey: "services.items.furniture.description",
  },
  {
    id: "panels",
    icon: Grid3x3,
    titleKey: "services.items.panels.title",
    descriptionKey: "services.items.panels.description",
  },
  {
    id: "signs",
    icon: Signpost,
    titleKey: "services.items.signs.title",
    descriptionKey: "services.items.signs.description",
  },
  {
    id: "custom",
    icon: Sparkles,
    titleKey: "services.items.custom.title",
    descriptionKey: "services.items.custom.description",
  },
];

/** يعرض الخدمة فقط إذا وُجد عمل منشور بنفس التصنيف */
export function getVisibleServices(activeCategories: ProjectCategory[]): ServiceItem[] {
  const active = new Set(activeCategories);
  return services.filter((service) => {
    if (service.id === "custom") return activeCategories.length > 0;
    return active.has(service.id as ProjectCategory);
  });
}
