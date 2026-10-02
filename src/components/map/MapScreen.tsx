"use client";

import { useEffect, useMemo, useState } from "react";

import MockMap from "@/components/map/MockMap";
import RestaurantCardCarousel from "@/components/restaurant/RestaurantCardCarousel";
import RestaurantDetail from "@/components/restaurant/RestaurantDetail";
import RestaurantFilter from "@/components/restaurant/RestaurantFilter";
import FoodDecisionSheet from "@/components/decision/FoodDecisionSheet";

import { mockRestaurants } from "@/data/mockRestaurants";
import {
  Restaurant,
  RestaurantCategory,
} from "@/types/restaurant";

export default function MapScreen() {
  const [category, setCategory] = useState<
    RestaurantCategory | "전체"
  >("전체");

  const [radius, setRadius] = useState(2);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const [showFeed, setShowFeed] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showDecision, setShowDecision] = useState(false);

  const [detailRestaurant, setDetailRestaurant] =
    useState<Restaurant | null>(null);

  const filteredRestaurants = useMemo(() => {
    return mockRestaurants.filter((restaurant) => {
      const categoryMatch =
        category === "전체" ||
        restaurant.category === category;

      const radiusMatch =
        restaurant.distance <= radius * 1000;

      return categoryMatch && radiusMatch;
    });
  }, [category, radius]);

  useEffect(() => {
    if (
      selectedIndex >= filteredRestaurants.length
    ) {
      setSelectedIndex(0);
    }
  }, [filteredRestaurants.length, selectedIndex]);

  const currentRestaurant =
    filteredRestaurants[selectedIndex] ??
    filteredRestaurants[0] ??
    null;

  const selectRestaurant = (restaurant: Restaurant) => {
    const index = filteredRestaurants.findIndex(
      (item) => item.id === restaurant.id,
    );

    if (index >= 0) {
      setSelectedIndex(index);
    }

    setShowFeed(true);
  };

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-[#e9eee8] text-gray-900">
      {/* MAP */}
      <MockMap
        restaurants={filteredRestaurants}
        selectedId={currentRestaurant?.id ?? null}
        onSelectRestaurant={selectRestaurant}
      />

      {/* TOP BAR */}
      <div className="absolute left-4 right-4 top-4 z-40 flex items-center justify-between">
        <div className="rounded-2xl bg-white/90 px-4 py-3 shadow-lg ring-1 ring-black/5 backdrop-blur">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
            FOOD DECISION
          </p>

          <h1 className="mt-0.5 text-lg font-black">
            먹결
          </h1>
        </div>

        <button
          type="button"
          className="rounded-2xl bg-white/90 px-4 py-3 text-sm font-semibold shadow-lg ring-1 ring-black/5 backdrop-blur"
        >
          📍 내 주변
        </button>
      </div>

      {/* RIGHT CONTROLS */}
      <div className="absolute right-4 top-[38%] z-40 flex flex-col gap-3">
        <button
          type="button"
          onClick={() => setShowDecision(true)}
          className="flex h-14 w-14 flex-col items-center justify-center rounded-2xl bg-white/95 text-[10px] font-bold shadow-xl ring-1 ring-black/5 backdrop-blur"
        >
          <span className="text-xl">🍴</span>
          음식 정하기
        </button>

        <button
          type="button"
          onClick={() => setShowFilter(true)}
          className="flex h-14 w-14 flex-col items-center justify-center rounded-2xl bg-white/95 text-[10px] font-bold shadow-xl ring-1 ring-black/5 backdrop-blur"
        >
          <span className="text-xl">⚙️</span>
          필터
        </button>
      </div>

      {/* FILTER STATUS */}
      <div className="absolute left-4 top-[15%] z-40">
        <div className="rounded-full bg-white/90 px-3 py-2 text-xs font-semibold shadow-md backdrop-blur">
          {category === "전체"
            ? "전체 맛집"
            : category}{" "}
          · {radius}km
        </div>
      </div>

      {/* FIND RESTAURANTS */}
      {!showFeed && (
        <div className="absolute bottom-7 left-4 right-4 z-40">
          <button
            type="button"
            onClick={() => setShowFeed(true)}
            className="mx-auto flex w-full max-w-md items-center justify-center gap-2 rounded-[22px] bg-black py-4 text-base font-black text-white shadow-2xl transition active:scale-[0.98]"
          >
            <span>맛집 찾아보기</span>
            <span className="text-lg">↑</span>
          </button>

          <p className="mt-2 text-center text-[11px] font-medium text-black/45">
            지도 위 맛집을 눌러도 바로 볼 수 있어요
          </p>
        </div>
      )}

      {/* RESTAURANT CAROUSEL */}
      {showFeed && (
        <div className="absolute inset-x-0 bottom-0 z-45 max-h-[88vh] overflow-hidden rounded-t-[34px] bg-black/10 px-2 pb-3 pt-3 backdrop-blur-md">
          <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-white/85" />

          <div className="mx-auto mb-1 flex max-w-xl items-center justify-between px-2">
            <div>
              <p className="text-xs font-semibold text-black/40">
                주변 맛집
              </p>

              <p className="text-sm font-black text-gray-900">
                {filteredRestaurants.length}곳 발견
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowFeed(false)}
              className="rounded-full bg-white px-3 py-2 text-xs font-bold shadow"
            >
              지도 보기
            </button>
          </div>

          <RestaurantCardCarousel
            restaurants={filteredRestaurants}
            selectedIndex={selectedIndex}
            onChange={setSelectedIndex}
            onOpenDetail={setDetailRestaurant}
          />
        </div>
      )}

      {/* FILTER */}
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

      {/* FOOD DECISION */}
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

      {/* DETAIL */}
      {detailRestaurant && (
        <RestaurantDetail
          restaurant={detailRestaurant}
          onClose={() => setDetailRestaurant(null)}
        />
      )}
    </main>
  );
}
