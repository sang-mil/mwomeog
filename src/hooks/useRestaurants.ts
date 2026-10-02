"use client";

import { useEffect, useState } from "react";

import {
  Restaurant,
  RestaurantCategory,
} from "@/types/restaurant";

import { searchRestaurants } from "@/lib/restaurant/searchRestaurants";

interface UseRestaurantsOptions {
  latitude: number;
  longitude: number;

  radiusKm: number;

  category: RestaurantCategory | "전체";

  provider?: string;
}

export function useRestaurants({
  latitude,
  longitude,
  radiusKm,
  category,
  provider = "mock",
}: UseRestaurantsOptions) {
  const [restaurants, setRestaurants] =
    useState<Restaurant[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadRestaurants() {
      try {
        setLoading(true);
        setError(null);

        const result =
          await searchRestaurants({
            latitude,
            longitude,
            radiusKm,
            category,
            provider,
          });

        if (!cancelled) {
          setRestaurants(result);
        }
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
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
  }, [
    latitude,
    longitude,
    radiusKm,
    category,
    provider,
  ]);

  return {
    restaurants,
    loading,
    error,
  };
}
