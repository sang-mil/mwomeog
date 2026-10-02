"use client";

import { foodCategories } from "@/data/mockRestaurants";
import { RestaurantCategory } from "@/types/restaurant";

interface RestaurantFilterProps {
  category: RestaurantCategory | "전체";
  radius: number;
  onCategoryChange: (category: RestaurantCategory | "전체") => void;
  onRadiusChange: (radius: number) => void;
  onClose: () => void;
}

export default function RestaurantFilter({
  category,
  radius,
  onCategoryChange,
  onRadiusChange,
  onClose,
}: RestaurantFilterProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-end bg-black/30 backdrop-blur-[2px]">
      <div className="w-full rounded-t-[32px] bg-white px-5 pb-8 pt-5 shadow-2xl">
        <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-gray-200" />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              FILTER
            </p>
            <h2 className="mt-1 text-xl font-bold text-gray-900">
              어떤 맛집을 찾을까요?
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100"
          >
            ✕
          </button>
        </div>

        <div className="mt-6">
          <p className="mb-3 text-sm font-bold text-gray-800">
            음식 종류
          </p>

          <div className="flex flex-wrap gap-2">
            {foodCategories.map((item) => {
              const active = category === item;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    onCategoryChange(
                      item as RestaurantCategory | "전체",
                    )
                  }
                  className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-7">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-bold text-gray-800">탐색 거리</p>
            <span className="text-sm font-bold text-gray-900">
              {radius}km
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 5].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onRadiusChange(item)}
                className={`rounded-2xl py-3 text-sm font-bold ${
                  radius === item
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {item}km
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-7 w-full rounded-2xl bg-black py-4 text-sm font-bold text-white"
        >
          이 조건으로 찾기
        </button>
      </div>
    </div>
  );
}
