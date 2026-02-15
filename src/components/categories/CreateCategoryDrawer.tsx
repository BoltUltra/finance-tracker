"use client";

import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, X } from "lucide-react";
import * as Icons from "lucide-react";
import { clsx } from "clsx";

// Icon options map
const ICONS = [
  "ShoppingBag",
  "Utensils",
  "Car",
  "Home",
  "Zap",
  "HeartPulse",
  "GraduationCap",
  "Gamepad2",
  "Plane",
  "Briefcase",
  "Gift",
  "MoreHorizontal",
  "Dumbbell",
  "Dog",
  "Music",
  "Coffee",
  "Smartphone",
  "Wifi",
  "CreditCard",
  "Landmark",
];

// Color options map
const COLORS = [
  "bg-red-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-yellow-500",
  "bg-lime-500",
  "bg-green-500",
  "bg-emerald-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-sky-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-violet-500",
  "bg-purple-500",
  "bg-fuchsia-500",
  "bg-pink-500",
  "bg-rose-500",
];

interface CreateCategoryDrawerProps {
  children: React.ReactNode;
  onCategoryCreated?: (categoryId: string) => void;
}

export function CreateCategoryDrawer({
  children,
  onCategoryCreated,
}: CreateCategoryDrawerProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("ShoppingBag");
  const [selectedColor, setSelectedColor] = useState("bg-purple-500");
  const [loading, setLoading] = useState(false);

  // Dynamic Icon Renderer
  const SelectedIconComponent =
    (Icons as any)[selectedIcon] || Icons.HelpCircle;

  const handleSave = async () => {
    if (!user || !name.trim()) return;
    setLoading(true);

    try {
      const docRef = await addDoc(
        collection(db, "users", user.uid, "categories"),
        {
          label: name,
          iconName: selectedIcon,
          color: selectedColor,
          type: "expense", // Default to expense for now
          createdAt: new Date(),
        },
      );

      setIsOpen(false);
      setName("");
      setSelectedIcon("ShoppingBag");
      setSelectedColor("bg-purple-500");

      if (onCategoryCreated) onCategoryCreated(docRef.id);
    } catch (error) {
      console.error("Error creating category:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="max-h-[96vh] font-outfit">
        <div className="mx-auto w-full max-w-md overflow-y-auto pb-6">
          <DrawerHeader className="flex justify-between items-center">
            <DrawerTitle>Create new category</DrawerTitle>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </DrawerHeader>

          <div className="px-6 space-y-6">
            {/* Icon Preview & Picker Trigger could go here, but sticking to simple grid for now */}
            <div className="flex flex-col items-center gap-4">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-full ${selectedColor} text-white shadow-lg`}
              >
                <SelectedIconComponent className="h-8 w-8" />
              </div>
              <p className="text-sm text-gray-500">Choose category icon</p>
            </div>

            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category name</label>
              <Input
                placeholder="Set name for category"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-50 border-gray-100"
              />
            </div>

            {/* Color Picker */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select color</label>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={clsx(
                      "h-8 w-8 shrink-0 rounded-full transition-all",
                      color,
                      selectedColor === color
                        ? "ring-2 ring-offset-2 ring-gray-400 scale-110"
                        : "",
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Icon Picker Grid */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Icon</label>
              <div className="grid grid-cols-5 gap-3">
                {ICONS.map((iconName) => {
                  const Icon = (Icons as any)[iconName];
                  return (
                    <button
                      key={iconName}
                      onClick={() => setSelectedIcon(iconName)}
                      className={clsx(
                        "flex items-center justify-center p-2 rounded-xl transition-all",
                        selectedIcon === iconName
                          ? "bg-gray-100 dark:bg-gray-800 ring-1 ring-gray-300"
                          : "hover:bg-gray-50",
                      )}
                    >
                      <Icon
                        className={clsx(
                          "h-6 w-6",
                          selectedIcon === iconName
                            ? "text-indigo-600"
                            : "text-gray-500",
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={loading || !name.trim()}
              className="w-full rounded-full bg-indigo-600 py-6 text-lg font-bold text-white hover:bg-indigo-700"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Save category"}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
