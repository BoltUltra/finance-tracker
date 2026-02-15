"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useCategories, AppCategory } from "@/hooks/useCategories";
import { Plus, Check } from "lucide-react";
import { clsx } from "clsx";
import { CreateCategoryDrawer } from "@/components/categories/CreateCategoryDrawer";
import { useState } from "react";

interface CategorySelectionDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (category: AppCategory) => void;
  selectedCategoryIds: string[];
}

export function CategorySelectionDrawer({
  open,
  onOpenChange,
  onSelect,
  selectedCategoryIds,
}: CategorySelectionDrawerProps) {
  const { categories, loading } = useCategories();

  // Local state to manage the Create Drawer visibility if needed,
  // but Shadcn Drawer composition might let us just nest the trigger.
  // Actually, standard nesting requires careful management.
  // We'll use a controlled state for the Create Drawer if explicit control is needed.

  const expenseCategories = categories.filter((c) => c.id !== "income");

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh] font-outfit">
        <DrawerHeader>
          <DrawerTitle className="text-center">Select Category</DrawerTitle>
        </DrawerHeader>

        <div className="overflow-y-auto px-4 pb-24 pt-2">
          <div className="space-y-2">
            {expenseCategories.map((cat: AppCategory) => {
              const isSelected = selectedCategoryIds.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  disabled={isSelected}
                  onClick={() => onSelect(cat)}
                  className={clsx(
                    "flex w-full items-center gap-4 rounded-xl border p-4 transition-all",
                    isSelected
                      ? "bg-gray-50 border-gray-100 opacity-50 dark:bg-gray-900 dark:border-gray-800"
                      : "bg-white border-gray-100 hover:bg-gray-50 dark:bg-black dark:border-gray-800 dark:hover:bg-gray-900",
                  )}
                >
                  <div
                    className={clsx(
                      "flex h-10 w-10 items-center justify-center rounded-full text-white",
                      !cat.color &&
                        "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
                    )}
                    style={{ backgroundColor: cat.color }}
                  >
                    {cat.icon && <cat.icon className="h-5 w-5" />}
                  </div>
                  <span className="flex-1 text-left font-medium text-gray-900 dark:text-white">
                    {cat.label}
                  </span>
                  {isSelected && <Check className="h-4 w-4 text-gray-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer with Create New Trigger */}
        <div className="absolute bottom-0 left-0 right-0 bg-white p-4 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
          <CreateCategoryDrawer
            onCategoryCreated={(newId) => {
              // Optionally auto-select the new category?
              // For now, clean close or just let user find it.
              // Ideally we find the category object and select it.
              // We'll rely on the list updating and user selecting it or implemented auto-select later.
            }}
          >
            <Button
              variant="outline"
              className="w-full gap-2 py-6 rounded-full border-dashed"
            >
              <Plus className="h-4 w-4" />
              Create new category
            </Button>
          </CreateCategoryDrawer>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
