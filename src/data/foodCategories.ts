import { RestaurantCategory } from "@/types/restaurant";

export const FOOD_CATEGORIES: (RestaurantCategory | "전체")[] = [
  "전체",
  "한식",
  "중식",
  "일식",
  "양식",
  "치킨",
  "분식",
  "카페",
  "기타",
];

export const CATEGORY_ICONS: Record<RestaurantCategory | "전체", string> = {
  전체: "🍽️",
  한식: "🍚",
  중식: "🥟",
  일식: "🍣",
  양식: "🍕",
  치킨: "🍗",
  분식: "🍢",
  카페: "☕",
  기타: "🥘",
};
