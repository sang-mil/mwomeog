import { Restaurant, RestaurantCategory } from "@/types/restaurant";

/**
 * 주어진 맛집 목록 중 무작위로 하나를 추천
 */
export function getRandomRestaurant(
  restaurants: Restaurant[],
  category?: RestaurantCategory | "전체",
): Restaurant | null {
  const filtered =
    !category || category === "전체"
      ? restaurants
      : restaurants.filter((r) => r.category === category);

  if (filtered.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}

/**
 * 룰렛용 색상 팔레트
 */
export const ROULETTE_PALETTE = [
  "#FF6B6B",
  "#FFA94D",
  "#FFD43B",
  "#69DB7C",
  "#4DABF7",
  "#9775FA",
  "#F06595",
  "#20C997",
];
