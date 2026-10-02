"use client";

import { useEffect, useState } from "react";
import { Restaurant, RestaurantCategory } from "@/types/restaurant";
import { getRestaurantProvider } from "@/lib/restaurant/providers/registry";

interface UseRestaurantsOptions {
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  category?: RestaurantCategory | "전체";
  provider?: string;
}

export function useRestaurants({
  latitude = 37.501,
  longitude = 127.039,
  radiusKm = 2,
  category = "전체",
  provider = "mock",
}: UseRestaurantsOptions = {}) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadRestaurants() {
      try {
        setLoading(true);
        setError(null);

        const currentProvider = getRestaurantProvider(provider);
        const result = await currentProvider.searchNearby({
          latitude,
          longitude,
          radiusKm,
          category,
        });

        if (!cancelled) {
          setRestaurants(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "맛집을 불러오지 못했습니다.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadRestaurants();

    return () => {
      cancelled = true;
    };
  }, [latitude, longitude, radiusKm, category, provider]);

  return {
    restaurants,
    loading,
    error,
  };
}
