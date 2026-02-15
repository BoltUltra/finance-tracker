"use client";

import { useCategories } from "@/hooks/useCategories";
import { usePathname, useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Loader2,
  Save,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { clsx } from "clsx";

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const {
    categories,
    loading,
    updateCategory,
    addSubCategory,
    deleteSubCategory,
    renameSubCategory,
  } = useCategories();

  const categoryId = params.categoryId as string;
  // @ts-ignore
  const category = categories.find((c) => c.id === categoryId);

  const [label, setLabel] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingSub, setIsAddingSub] = useState(false);

  // Subcategory Editing State
  const [editingSub, setEditingSub] = useState<string | null>(null);
  const [editSubValue, setEditSubValue] = useState("");

  useEffect(() => {
    if (category) {
      setLabel(category.label);
    }
  }, [category]);

  const handleDeleteSub = async (subLabel: string) => {
    if (!confirm("Are you sure you want to delete this subcategory?")) return;
    try {
      await deleteSubCategory(categoryId, subLabel);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveRenameSub = async (oldLabel: string) => {
    if (!editSubValue.trim() || editSubValue === oldLabel) {
      setEditingSub(null);
      return;
    }
    try {
      await renameSubCategory(categoryId, oldLabel, editSubValue);
      setEditingSub(null);
      setEditSubValue("");
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex bg-gray-50 dark:bg-black min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold">Category not found</h2>
        <Link
          href="/settings/categories"
          className="text-indigo-600 mt-4 block"
        >
          Go back
        </Link>
      </div>
    );
  }

  // Handle Rename
  const handleRename = async () => {
    setIsSaving(true);
    try {
      await updateCategory(category.id, { label });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Add Subcategory
  const handleAddSubCategory = async () => {
    if (!newSubCategory.trim()) return;
    setIsAddingSub(true);
    try {
      // Optimistically update UI? No, rely on real-time hook.
      await addSubCategory(category.id, newSubCategory);
      setNewSubCategory("");
    } catch (error) {
      console.error(error);
      alert(
        "Could not add subcategory to this type of category (likely a default one which is restricted for now).",
      );
    } finally {
      setIsAddingSub(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 pb-24 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/settings/categories"
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-900 dark:text-gray-100" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Edit Category
        </h1>
      </div>

      {/* Main Info */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
        <div className="flex justify-center">
          <div
            className={clsx(
              "flex h-20 w-20 items-center justify-center rounded-full text-white shadow-lg",
              !category.color && "bg-gray-200 text-gray-500",
            )}
            style={{ backgroundColor: category.color }}
          >
            {category.icon && <category.icon className="h-10 w-10" />}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-500">
            Category Name
          </label>
          <div className="flex gap-2">
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="bg-gray-50 border-gray-200"
            />
            <Button
              onClick={handleRename}
              disabled={isSaving || label === category.label}
              size="icon"
              className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Subcategories */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Subcategories
        </h2>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          {category.subCategories && category.subCategories.length > 0 ? (
            category.subCategories.map((sub, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 last:border-0"
              >
                {editingSub === (typeof sub === "string" ? sub : sub.label) ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={editSubValue}
                      onChange={(e) => setEditSubValue(e.target.value)}
                      className="h-8"
                      autoFocus
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() =>
                        handleSaveRenameSub(
                          typeof sub === "string" ? sub : sub.label,
                        )
                      }
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                      onClick={() => {
                        setEditingSub(null);
                        setEditSubValue("");
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <span className="flex-1">
                      {typeof sub === "string" ? sub : sub.label}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                        onClick={() => {
                          const val = typeof sub === "string" ? sub : sub.label;
                          setEditingSub(val);
                          setEditSubValue(val);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() =>
                          handleDeleteSub(
                            typeof sub === "string" ? sub : sub.label,
                          )
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-400">
              No subcategories yet.
            </div>
          )}
        </div>

        {/* Add Subcategory Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Add a subcategory..."
            value={newSubCategory}
            onChange={(e) => setNewSubCategory(e.target.value)}
            className="bg-white border-gray-200"
          />
          <Button
            onClick={handleAddSubCategory}
            disabled={!newSubCategory.trim() || isAddingSub}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isAddingSub ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>
        {!category.isCustom && (
          <p className="text-xs text-gray-500">
            Note: Adding subcategories to default categories might not be
            supported fully in reports yet.
          </p>
        )}
      </div>
    </div>
  );
}
