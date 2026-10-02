import {
  Restaurant,
  RestaurantCategory,
} from "@/types/restaurant";

export interface RestaurantSearchParams {
  latitude: number;
  longitude: number;

  radiusKm: number;

  category?: RestaurantCategory | "전체";

  keyword?: string;

  limit?: number;
}

export interface RestaurantProvider {
  readonly id: string;
  readonly name: string;

  searchNearby(
    params: RestaurantSearchParams,
  ): Promise<Restaurant[]>;

  getRestaurant?(
    id: string,
  ): Promise<Restaurant | null>;
}
