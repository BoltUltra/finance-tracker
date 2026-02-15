"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CategoryDetailHeader() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between mb-8 font-outfit">
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 text-gray-900 bg-white"
        onClick={() => router.back()}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <h1 className="text-lg font-semibold text-gray-900">Category detail</h1>

      {/* <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 text-gray-900 bg-white"
      >
        <Settings className="h-5 w-5" />
      </Button> */}
      <div></div>
    </div>
  );
}
