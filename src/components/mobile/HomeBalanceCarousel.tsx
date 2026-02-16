"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Plus, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserData } from "@/hooks/useUserData";
import { formatCurrency } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { clsx } from "clsx";

interface HomeBalanceCarouselProps {
  onAdd: () => void;
  onTransfer: () => void;
}

export function HomeBalanceCarousel({
  onAdd,
  onTransfer,
}: HomeBalanceCarouselProps) {
  const { userData } = useUserData();
  const [isVisible, setIsVisible] = useState(true);
  const [api, setApi] = useState<any>(); // CarouselApi type is generic, using any for simplicity or import it
  const [current, setCurrent] = useState(0);

  const totalBalance = (userData?.bank || 0) + (userData?.cash || 0);

  const slides = [
    {
      label: "Total Balance",
      balance: totalBalance,
      color: "bg-gray-900 dark:bg-black",
      showActions: true,
      pattern: "total",
    },
    {
      label: "Cash",
      balance: userData?.cash || 0,
      color: "bg-green-600",
      showActions: false,
      pattern: "wave",
    },
    {
      label: "Bank",
      balance: userData?.bank || 0,
      color: "bg-blue-600",
      showActions: false,
      pattern: "wave",
    },
    {
      label: "Savings",
      balance: userData?.savings || 0,
      color: "bg-purple-600",
      showActions: false,
      pattern: "wave",
    },
  ];

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="w-full py-4 space-y-4">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="pl-4 basis-10/12 md:basis-1/2">
              <BalanceCard
                {...slide}
                isVisible={isVisible}
                onToggleVisibility={() => setIsVisible(!isVisible)}
                onAdd={onAdd}
                onTransfer={onTransfer}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-1.5">
        {slides.map((_, index) => (
          <div
            key={index}
            className={clsx(
              "h-1.5 rounded-full transition-all duration-300",
              current === index
                ? "w-6 bg-indigo-600"
                : "w-1.5 bg-gray-200 dark:bg-gray-700",
            )}
          />
        ))}
      </div>
    </div>
  );
}

interface BalanceCardProps {
  label: string;
  balance: number;
  color: string;
  showActions: boolean;
  isVisible: boolean;
  onToggleVisibility: () => void;
  onAdd: () => void;
  onTransfer: () => void;
  pattern?: string;
}

import { useHaptic } from "@/hooks/useHaptic";

// ... (existing imports)

interface BalanceCardProps {
  // ...
}

function BalanceCard({
  label,
  balance,
  color,
  showActions,
  isVisible,
  onToggleVisibility,
  onAdd,
  onTransfer,
  pattern,
}: BalanceCardProps) {
  const { trigger } = useHaptic();

  const handleToggle = () => {
    trigger("light");
    onToggleVisibility();
  };

  const handleAdd = () => {
    trigger("medium");
    onAdd();
  };

  const handleTransfer = () => {
    trigger("medium");
    onTransfer();
  };

  return (
    <Card
      className={clsx(
        "overflow-hidden border-0 text-white shadow-xl relative h-[220px] transition-all",
        color,
      )}
    >
      {/* Wavy Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg
          viewBox="0 0 1440 320"
          className="absolute bottom-0 w-full h-full preserve-3d"
          preserveAspectRatio="none"
        >
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      <CardContent className="p-6 relative z-10 flex flex-col h-full justify-between">
        <div>
          <div className="flex items-center gap-2 text-white/70 mb-2">
            <span className="text-sm font-medium">{label}</span>
            <button
              onClick={onToggleVisibility}
              className="rounded-full p-1 hover:bg-white/10 transition-colors"
            >
              {isVisible ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </button>
          </div>

          <div>
            <h2 className="text-4xl font-bold tracking-tight">
              {isVisible
                ? formatCurrency(balance)
                : formatCurrency(123456).replace(/[0-9]/g, "•")}
            </h2>
          </div>
        </div>

        {showActions && (
          <div className="grid grid-cols-2 gap-3 mt-4">
            <Button
              onClick={onAdd}
              className="bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm h-12"
            >
              <Plus className="mr-1 h-4 w-4" /> Add Transaction
            </Button>
            <Button
              onClick={onTransfer}
              className="bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm h-12"
            >
              <ArrowUpRight className="mr-1 h-4 w-4" /> Transfer
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
