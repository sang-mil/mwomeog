import { mockRestaurants } from "@/data/mockRestaurants";
import {
  Restaurant,
  RestaurantCategory,
} from "@/types/restaurant";
import {
  RestaurantProvider,
  RestaurantSearchParams,
} from "./types";

export class MockRestaurantProvider
  implements RestaurantProvider
{
  readonly id = "mock";
  readonly name = "Mock Restaurant";

  async searchNearby(
    params: RestaurantSearchParams,
  ): Promise<Restaurant[]> {
    const {
      radiusKm,
      category = "전체",
      limit = 50,
    } = params;

    let results = [...mockRestaurants];

    if (category !== "전체") {
      results = results.filter(
        (restaurant) =>
          restaurant.category ===
          (category as RestaurantCategory),
      );
    }

    results = results.filter(
      (restaurant) =>
        restaurant.distance <= radiusKm * 1000,
    );

    results.sort(
      (a, b) => a.distance - b.distance,
    );

    return results
      .slice(0, limit)
      .map((restaurant) => ({
        ...restaurant,
        source: "mock",
      }));
  }

  async getRestaurant(
    id: string,
  ): Promise<Restaurant | null> {
    return (
      mockRestaurants.find(
        (restaurant) => restaurant.id === id,
      ) ?? null
    );
  }
}
