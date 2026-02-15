"use client";

import { useCategories } from "@/hooks/useCategories";
import { SettingsItem } from "@/components/settings/SettingsItem";
import { CreateCategoryDrawer } from "@/components/categories/CreateCategoryDrawer";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { clsx } from "clsx";

export default function CategoriesPage() {
  const { categories, loading } = useCategories();

  if (loading) {
    return (
      <div className="flex bg-gray-50 dark:bg-black min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 pb-24 space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/settings"
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-900 dark:text-gray-100" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Categories
        </h1>
      </div>

      <div className="space-y-4">
        {categories.map((cat) => (
          <SettingsItem
            key={cat.id}
            icon={
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: cat.color || "#6B7280" }}
              >
                {cat.icon ? <cat.icon className="h-4 w-4" /> : null}
              </div>
            }
            label={cat.label}
            href={`/settings/categories/${cat.id}`}
          />
        ))}

        <CreateCategoryDrawer>
          <button className="flex items-center gap-4 w-full p-4 bg-white rounded-2xl border border-dashed border-gray-300 text-gray-500 hover:bg-gray-50 hover:border-indigo-300 hover:text-indigo-600 transition-all group">
            <div className="p-2 rounded-xl bg-gray-100 group-hover:bg-indigo-100 text-gray-500 group-hover:text-indigo-600 transition-colors">
              <Plus className="w-5 h-5" />
            </div>
            <span className="font-medium text-lg">Create new category</span>
          </button>
        </CreateCategoryDrawer>
      </div>
    </div>
  );
}
