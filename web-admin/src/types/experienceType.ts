export interface ExperienceType {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}