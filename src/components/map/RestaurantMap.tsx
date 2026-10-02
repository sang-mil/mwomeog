"use client";

import KakaoMap from "./KakaoMap";
import MockMap from "./MockMap";
import { Restaurant } from "@/types/restaurant";

interface RestaurantMapProps {
  restaurants: Restaurant[];
  selectedId: string | null;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  centerLatitude?: number;
  centerLongitude?: number;
  radiusKm?: number;
  useRealMap?: boolean;
}

export default function RestaurantMap({
  restaurants,
  selectedId,
  onSelectRestaurant,
  centerLatitude = 37.497952,
  centerLongitude = 127.027619,
  radiusKm = 2,
  useRealMap = true,
}: RestaurantMapProps) {
  const hasKakaoKey =
    !!process.env.KAKAO_MAP_API_KEY ||
    !!process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;

  if (useRealMap && hasKakaoKey) {
    return (
      <KakaoMap
        restaurants={restaurants}
        selectedId={selectedId}
        onSelectRestaurant={onSelectRestaurant}
        centerLatitude={centerLatitude}
        centerLongitude={centerLongitude}
        radiusKm={radiusKm}
      />
    );
  }

  return (
    <MockMap
      restaurants={restaurants}
      selectedId={selectedId}
      onSelectRestaurant={onSelectRestaurant}
    />
  );
}
