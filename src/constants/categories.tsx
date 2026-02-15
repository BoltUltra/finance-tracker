import {
  ShoppingBag,
  Utensils,
  Car,
  Home,
  Zap,
  HeartPulse,
  GraduationCap,
  Gamepad2,
  Plane,
  Briefcase,
  Gift,
  MoreHorizontal,
} from "lucide-react";

export interface SubCategory {
  id: string;
  label: string;
}

export interface Category {
  id: string;
  label: string;
  icon: any; // Lucide icon component
  subCategories: SubCategory[];
  color: string;
}

export const CATEGORY_CONFIG: Category[] = [
  {
    id: "food",
    label: "Food & Dining",
    icon: Utensils,
    color: "#F97316", // Orange-500
    subCategories: [
      { id: "groceries", label: "Groceries" },
      { id: "restaurants", label: "Restaurants" },
      { id: "coffee", label: "Coffee & Snacks" },
      { id: "alcohol", label: "Alcohol" },
    ],
  },
  {
    id: "transport",
    label: "Transportation",
    icon: Car,
    color: "#3B82F6", // Blue-500
    subCategories: [
      { id: "fuel", label: "Fuel/Gas" },
      { id: "public_transport", label: "Public Transport" },
      { id: "taxi", label: "Taxi/Rideshare" },
      { id: "maintenance", label: "Car Maintenance" },
      { id: "parking", label: "Parking" },
    ],
  },
  {
    id: "housing",
    label: "Housing",
    icon: Home,
    color: "#6366F1", // Indigo-500
    subCategories: [
      { id: "rent", label: "Rent/Mortgage" },
      { id: "maintenance", label: "Maintenance" },
      { id: "services", label: "Services" },
    ],
  },
  {
    id: "utilities",
    label: "Utilities",
    icon: Zap,
    color: "#06B6D4", // Cyan-500
    subCategories: [
      { id: "electricity", label: "Electricity" },
      { id: "water", label: "Water" },
      { id: "internet", label: "Internet" },
      { id: "phone", label: "Phone" },
      { id: "gas", label: "Gas/Heating" },
    ],
  },
  {
    id: "shopping",
    label: "Shopping",
    icon: ShoppingBag,
    color: "#EC4899", // Pink-500
    subCategories: [
      { id: "clothing", label: "Clothing" },
      { id: "electronics", label: "Electronics" },
      { id: "home", label: "Home & Garden" },
      { id: "hobbies", label: "Hobbies" },
    ],
  },
  {
    id: "health",
    label: "Health & Wellness",
    icon: HeartPulse,
    color: "#EF4444", // Red-500
    subCategories: [
      { id: "pharmacy", label: "Pharmacy" },
      { id: "doctor", label: "Doctor" },
      { id: "sports", label: "Sports & Gym" },
    ],
  },
  {
    id: "travel",
    label: "Travel",
    icon: Plane,
    color: "#14B8A6", // Teal-500
    subCategories: [
      { id: "flights", label: "Flights" },
      { id: "hotel", label: "Hotel" },
      { id: "transport", label: "Local Transport" },
    ],
  },
  {
    id: "education",
    label: "Education",
    icon: GraduationCap,
    color: "#F59E0B", // Amber-500
    subCategories: [
      { id: "books", label: "Books" },
      { id: "courses", label: "Courses" },
    ],
  },
  {
    id: "entertainment",
    label: "Entertainment",
    icon: Gamepad2,
    color: "#A855F7", // Purple-500
    subCategories: [
      { id: "movies", label: "Movies" },
      { id: "games", label: "Games" },
      { id: "events", label: "Events" },
      { id: "streaming", label: "Subscriptions" },
    ],
  },
  {
    id: "income",
    label: "Income Sources",
    icon: Briefcase,
    color: "#22C55E", // Green-500
    subCategories: [
      { id: "salary", label: "Salary" },
      { id: "gift", label: "Gift" },
      { id: "others", label: "Others" },
    ],
  },
  {
    id: "other",
    label: "Other",
    icon: MoreHorizontal,
    color: "#6B7280", // Gray-500
    subCategories: [
      { id: "charity", label: "Charity" },
      { id: "gifts", label: "Gifts" },
      { id: "misc", label: "Miscellaneous" },
    ],
  },
];

export const getCategoryById = (id: string) =>
  CATEGORY_CONFIG.find((c) => c.id === id);
