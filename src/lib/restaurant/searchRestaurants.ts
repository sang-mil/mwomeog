import {
  Restaurant,
  RestaurantCategory,
} from "@/types/restaurant";

import {
  getRestaurantProvider,
} from "./providers/registry";

interface SearchRestaurantsParams {
  latitude: number;
  longitude: number;
  radiusKm: number;
  category?: RestaurantCategory | "전체";
  keyword?: string;
  provider?: string;
  limit?: number;
}

export async function searchRestaurants({
  latitude,
  longitude,
  radiusKm,
  category = "전체",
  keyword,
  provider = "mock",
  limit = 50,
}: SearchRestaurantsParams): Promise<Restaurant[]> {
  const restaurantProvider =
    getRestaurantProvider(provider);

  return restaurantProvider.searchNearby({
    latitude,
    longitude,
    radiusKm,
    category,
    keyword,
    limit,
  });
}