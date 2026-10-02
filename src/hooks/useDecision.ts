"use client";

import { useState } from "react";
import { RestaurantCategory } from "@/types/restaurant";
import { DecisionMode } from "@/types/decision";

export function useDecision() {
  const [mode, setMode] = useState<DecisionMode>("menu");
  const [selectedCategory, setSelectedCategory] = useState<RestaurantCategory | null>(null);

  const chooseCategory = (category: RestaurantCategory) => {
    setSelectedCategory(category);
  };

  const resetDecision = () => {
    setMode("menu");
    setSelectedCategory(null);
  };

  return {
    mode,
    setMode,
    selectedCategory,
    chooseCategory,
    resetDecision,
  };
}
