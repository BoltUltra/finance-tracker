import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Edit2, X } from "lucide-react";
import { useCategories, AppCategory } from "@/hooks/useCategories";
import { CategorySelectionDrawer } from "@/components/budget/CategorySelectionDrawer";
import { clsx } from "clsx";
import { useState } from "react";

interface CategoryAllocationListProps {
  allocations: Record<string, number>;
  onAllocate: (categoryId: string, amount: number) => void;
  onRemove?: (categoryId: string) => void; // Optional remove callback
}

export function CategoryAllocationList({
  allocations,
  onAllocate,
  onRemove,
}: CategoryAllocationListProps) {
  const { categories, loading } = useCategories();
  const [isSelectionOpen, setIsSelectionOpen] = useState(false);

  // Get category objects for current allocations
  const activeCategories = Object.keys(allocations)
    .map((id) => categories.find((c) => c.id === id))
    .filter((c): c is AppCategory => !!c);

  const handleSelectCategory = (category: AppCategory) => {
    // Add to allocations with 0 amount if not exists
    if (allocations[category.id] === undefined) {
      onAllocate(category.id, 0);
    }
    setIsSelectionOpen(false);
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
          Set Budget category
        </h3>
        {/* <Button
          variant="ghost"
          size="sm"
          className="h-auto p-0 text-purple-600 hover:text-purple-700 hover:bg-transparent"
        >
          Edit <Edit2 className="ml-1 h-3 w-3" />
        </Button> */}
      </div>

      <div className="space-y-4">
        {activeCategories.length === 0 && (
          <p className="text-center text-sm text-gray-500 py-4 italic">
            No categories added yet. Tap below to start.
          </p>
        )}

        {activeCategories.map((cat: AppCategory) => (
          <div
            key={cat.id}
            className="flex items-center gap-4 rounded-xl border border-gray-50 bg-gray-50 p-3 dark:bg-gray-800/50 dark:border-gray-800 group"
          >
            <div
              className={clsx(
                "flex h-10 w-10 items-center justify-center rounded-full text-white shrink-0",
                !cat.color &&
                  "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
              )}
              style={{ backgroundColor: cat.color }}
            >
              {cat.icon && <cat.icon className="h-5 w-5" />}
            </div>
            <div className="flex-1">
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {cat.label}
              </span>
            </div>
            <div className="relative w-24">
              <Input
                type="number"
                value={allocations[cat.id] || ""}
                onChange={(e) => onAllocate(cat.id, Number(e.target.value))}
                className="h-9 bg-white text-right pr-2 dark:bg-gray-900"
                placeholder="0"
              />
            </div>
            {/* Optional: Remove button */}
          </div>
        ))}

        {/* Trigger Selection Drawer */}
        <div onClick={() => setIsSelectionOpen(true)}>
          <Button
            variant="outline"
            className="w-full justify-start gap-2 border-dashed border-gray-300 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <Plus className="h-4 w-4" />
            Add category
          </Button>
        </div>

        <CategorySelectionDrawer
          open={isSelectionOpen}
          onOpenChange={setIsSelectionOpen}
          onSelect={handleSelectCategory}
          selectedCategoryIds={Object.keys(allocations)}
        />
      </div>
    </div>
  );
}
