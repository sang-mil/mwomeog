import { RestaurantCategory } from "./restaurant";

export type DecisionMode = "menu" | "question" | "roulette" | "ladder";

export interface FoodQuestionOption {
  label: string;
  emoji: string;
  categories: RestaurantCategory[];
}

export interface FoodQuestionStep {
  id: number;
  question: string;
  description: string;
  options: [FoodQuestionOption, FoodQuestionOption];
}

export interface RouletteItem {
  id: string;
  name: string;
  category: RestaurantCategory;
  color: string;
}

export interface LadderResult {
  startIdx: number;
  endIdx: number;
  path: { x: number; y: number }[];
}
