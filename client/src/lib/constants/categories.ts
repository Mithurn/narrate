import {
  Newspaper,
  TrendingUp,
  Cpu,
  Brain,
  Briefcase,
  FlaskConical,
  HeartPulse,
  Trophy,
  Globe,
  type LucideIcon,
} from "lucide-react";

export interface Category {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const CATEGORIES: Category[] = [
  { id: "latest", label: "Latest", icon: Newspaper },
  { id: "trending", label: "Trending", icon: TrendingUp },
  { id: "technology", label: "Technology", icon: Cpu },
  { id: "ai", label: "AI", icon: Brain },
  { id: "business", label: "Business", icon: Briefcase },
  { id: "science", label: "Science", icon: FlaskConical },
  { id: "health", label: "Health", icon: HeartPulse },
  { id: "sports", label: "Sports", icon: Trophy },
  { id: "world", label: "World", icon: Globe },
];
