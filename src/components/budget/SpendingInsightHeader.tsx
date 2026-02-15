"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SpendingInsightHeader() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between mb-8">
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 text-gray-900 bg-white"
        onClick={() => router.back()}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <h1 className="text-lg font-semibold text-gray-900 font-outfit">
        Spending insight
      </h1>

      <Select defaultValue="jan">
        <SelectTrigger className="w-[80px] h-9 rounded-full bg-white border-0 text-gray-900 font-medium">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="jan">Jan</SelectItem>
          <SelectItem value="feb">Feb</SelectItem>
          <SelectItem value="mar">Mar</SelectItem>
          {/* Add more months dynamically later */}
        </SelectContent>
      </Select>
    </div>
  );
}
