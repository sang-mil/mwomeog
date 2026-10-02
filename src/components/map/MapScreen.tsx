"use client";

import { useEffect, useState, useCallback } from "react";

import RestaurantMap from "@/components/map/RestaurantMap";
import RestaurantCardCarousel from "@/components/restaurant/RestaurantCardCarousel";
import RestaurantDetail from "@/components/restaurant/RestaurantDetail";
import RestaurantFilter from "@/components/restaurant/RestaurantFilter";
import FoodDecisionSheet from "@/components/decision/FoodDecisionSheet";

import { mockRestaurants } from "@/data/mockRestaurants";
import { getRestaurantProvider } from "@/lib/restaurant/providers/registry";
import { Restaurant, RestaurantCategory } from "@/types/restaurant";

// 기본 중심 좌표 (서울 강남역)
const DEFAULT_CENTER = {
  latitude: 37.497952,
  longitude: 127.027619,
};

export default function MapScreen() {
  const [category, setCategory] = useState<RestaurantCategory | "전체">("전체");
  const [radius, setRadius] = useState(2);
  const [location, setLocation] = useState(DEFAULT_CENTER);
  const [locationName, setLocationName] = useState("내 주변");

  const [restaurants, setRestaurants] = useState<Restaurant[]>(mockRestaurants);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [showFeed, setShowFeed] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showDecision, setShowDecision] = useState(false);
  const [detailRestaurant, setDetailRestaurant] = useState<Restaurant | null>(null);

  // 1. 현재 사용자 GPS 위치 가져오기
  const refreshCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setLocationName("현재 위치");
      },
      (err) => {
        console.warn("Geolocation access denied or failed, using default location:", err);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  useEffect(() => {
    refreshCurrentLocation();
  }, [refreshCurrentLocation]);

  // 2. 카카오 실제 맛집 데이터 조회
  useEffect(() => {
    let cancelled = false;

    async function fetchRestaurants() {
      try {
        setLoading(true);
        const provider = getRestaurantProvider("kakao");
        const results = await provider.searchNearby({
          latitude: location.latitude,
          longitude: location.longitude,
          radiusKm: radius,
          category,
          limit: 35,
        });

        if (!cancelled) {
          if (results.length > 0) {
            setRestaurants(results);
          } else {
            // 카카오 검색 결과가 없을 경우 목업 데이터에서 필터링하여 대체
            const fallback = mockRestaurants.filter((r) => {
              const catMatch = category === "전체" || r.category === category;
              const radMatch = r.distance <= radius * 1000;
              return catMatch && radMatch;
            });
            setRestaurants(fallback);
          }
          setSelectedIndex(0);
        }
      } catch (err) {
        console.error("Failed to fetch kakao restaurants:", err);
        if (!cancelled) {
          setRestaurants(mockRestaurants);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchRestaurants();

    return () => {
      cancelled = true;
    };
  }, [location.latitude, location.longitude, radius, category]);

  const currentRestaurant =
    restaurants[selectedIndex] ?? restaurants[0] ?? null;

  const selectRestaurant = (restaurant: Restaurant) => {
    const index = restaurants.findIndex((item) => item.id === restaurant.id);
    if (index >= 0) {
      setSelectedIndex(index);
    }
    setShowFeed(true);
  };

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-[#e9eee8] text-gray-900">
      {/* REAL KAKAO / MOCK MAP */}
      <RestaurantMap
        restaurants={restaurants}
        selectedId={currentRestaurant?.id ?? null}
        onSelectRestaurant={selectRestaurant}
        centerLatitude={location.latitude}
        centerLongitude={location.longitude}
        radiusKm={radius}
        useRealMap={true}
      />

      {/* TOP BAR */}
      <div className="absolute left-4 right-4 top-4 z-40 flex items-center justify-between">
        <div className="rounded-2xl bg-white/95 px-4 py-3 shadow-lg ring-1 ring-black/5 backdrop-blur">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500">
            FOOD DECISION
          </p>
          <h1 className="mt-0.5 text-lg font-black text-gray-900">먹결</h1>
        </div>

        <button
          type="button"
          onClick={refreshCurrentLocation}
          className="flex items-center gap-1.5 rounded-2xl bg-white/95 px-4 py-3 text-xs font-bold text-gray-800 shadow-lg ring-1 ring-black/5 backdrop-blur transition active:scale-95"
        >
          <span>📍</span>
          <span>{locationName}</span>
        </button>
      </div>

      {/* RIGHT CONTROLS */}
      <div className="absolute right-4 top-[38%] z-40 flex flex-col gap-3">
        <button
          type="button"
          onClick={() => setShowDecision(true)}
          className="flex h-14 w-14 flex-col items-center justify-center rounded-2xl bg-white/95 text-[10px] font-bold shadow-xl ring-1 ring-black/5 backdrop-blur transition active:scale-95"
        >
          <span className="text-xl">🍴</span>
          음식 정하기
        </button>

        <button
          type="button"
          onClick={() => setShowFilter(true)}
          className="flex h-14 w-14 flex-col items-center justify-center rounded-2xl bg-white/95 text-[10px] font-bold shadow-xl ring-1 ring-black/5 backdrop-blur transition active:scale-95"
        >
          <span className="text-xl">⚙️</span>
          필터
        </button>
      </div>

      {/* FILTER & LOCATION STATUS */}
      <div className="absolute left-4 top-[15%] z-40 flex items-center gap-2">
        <div className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-gray-800 shadow-md backdrop-blur">
          {category === "전체" ? "전체 맛집" : category} · {radius}km
        </div>

        {loading && (
          <div className="flex items-center gap-1 rounded-full bg-black/70 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur">
            <div className="h-2 w-2 animate-spin rounded-full border border-white border-t-transparent" />
            <span>맛집 찾는 중...</span>
          </div>
        )}
      </div>

      {/* FIND RESTAURANTS BUTTON */}
      {!showFeed && (
        <div className="absolute bottom-7 left-4 right-4 z-40">
          <button
            type="button"
            onClick={() => setShowFeed(true)}
            className="mx-auto flex w-full max-w-md items-center justify-center gap-2 rounded-[22px] bg-black py-4 text-base font-black text-white shadow-2xl transition active:scale-[0.98]"
          >
            <span>맛집 찾아보기 ({restaurants.length}곳)</span>
            <span className="text-lg">↑</span>
          </button>

          <p className="mt-2 text-center text-[11px] font-medium text-black/50">
            지도 위 핀을 누르면 바로 맛집 카드를 볼 수 있어요
          </p>
        </div>
      )}

      {/* REELS STYLE RESTAURANT CAROUSEL */}
      {showFeed && (
        <div className="absolute inset-x-0 bottom-0 z-45 max-h-[88vh] overflow-hidden rounded-t-[34px] bg-black/15 px-2 pb-3 pt-3 backdrop-blur-md">
          <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-white/85" />

          <div className="mx-auto mb-1 flex max-w-xl items-center justify-between px-2">
            <div>
              <p className="text-xs font-semibold text-black/50">내 주변 맛집 피드</p>
              <p className="text-sm font-black text-gray-900">
                {restaurants.length}곳 발견
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowFeed(false)}
              className="rounded-full bg-white px-3 py-2 text-xs font-bold text-gray-800 shadow transition active:scale-95"
            >
              지도 보기
            </button>
          </div>

          <RestaurantCardCarousel
            restaurants={restaurants}
            selectedIndex={selectedIndex}
            onChange={setSelectedIndex}
            onOpenDetail={setDetailRestaurant}
          />
        </div>
      )}

      {/* FILTER SHEET */}
      {showFilter && (
        <RestaurantFilter
          category={category}
          radius={radius}
          onCategoryChange={(value) => {
            setCategory(value);
            setSelectedIndex(0);
          }}
          onRadiusChange={(value) => {
            setRadius(value);
            setSelectedIndex(0);
          }}
          onClose={() => setShowFilter(false)}
        />
      )}

      {/* FOOD DECISION SHEET */}
      {showDecision && (
        <FoodDecisionSheet
          onClose={() => setShowDecision(false)}
          onApplyCategory={(newCat) => {
            setCategory(newCat);
            setSelectedIndex(0);
            setShowFeed(true);
          }}
        />
      )}

      {/* DETAIL MODAL */}
      {detailRestaurant && (
        <RestaurantDetail
          restaurant={detailRestaurant}
          onClose={() => setDetailRestaurant(null)}
        />
      )}
    </main>
  );
}
