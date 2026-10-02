import { mockRestaurants } from "@/data/mockRestaurants";
import { Restaurant, RestaurantCategory } from "@/types/restaurant";

export interface FetchRestaurantsParams {
  latitude: number;
  longitude: number;
  radiusKm: number;
  category?: RestaurantCategory | "전체";
}

/**
 * 맛집 목록 비동기 API 모의 함수 (향후 백엔드 API 연동 가능)
 */
export async function fetchNearbyRestaurants(
  params: FetchRestaurantsParams,
): Promise<Restaurant[]> {
  const { radiusKm, category = "전체" } = params;

  // 네트워크 딜레이 모의
  await new Promise((resolve) => setTimeout(resolve, 150));

  let results = [...mockRestaurants];

  if (category !== "전체") {
    results = results.filter((r) => r.category === category);
  }

  results = results.filter((r) => r.distance <= radiusKm * 1000);

  return results.sort((a, b) => a.distance - b.distance);
}
