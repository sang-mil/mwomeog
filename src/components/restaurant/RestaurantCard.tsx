"use client";

import Image from "next/image";
import { Restaurant } from "@/types/restaurant";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPrevious?: () => void;
  onNext?: () => void;
  onOpenDetail: () => void;
}

export default function RestaurantCard({
  restaurant,
  onPrevious,
  onNext,
  onOpenDetail,
}: RestaurantCardProps) {
  return (
    <div className="w-full overflow-hidden rounded-[28px] bg-white shadow-2xl ring-1 ring-black/5">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-sm text-white">
            🍴
          </div>

          <div>
            <p className="text-sm font-bold text-gray-900">
              오늘의 발견
            </p>

            <p className="text-[11px] text-gray-400">
              내 주변 · {restaurant.distance}m
            </p>
          </div>
        </div>

        <button
          type="button"
          className="text-xl text-gray-400"
          aria-label="더보기"
        >
          •••
        </button>
      </div>

      {/* Image */}
      <div className="relative aspect-[4/4.3] w-full overflow-hidden bg-gray-100">
        <Image
          src={restaurant.imageUrl}
          alt={`${restaurant.name} 음식 사진`}
          fill
          sizes="(max-width: 768px) 100vw, 448px"
          className="object-cover"
        />

        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        {/* Category */}
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-gray-800 backdrop-blur">
            {restaurant.category}
          </span>

          {restaurant.isOpen && (
            <span className="rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white">
              영업 중
            </span>
          )}
        </div>

        {/* Main information */}
        <div className="absolute bottom-5 left-5 right-5 text-white">
          <h2 className="text-2xl font-black tracking-tight">
            {restaurant.name}
          </h2>

          <p className="mt-1 text-sm text-white/85">
            ⭐ {restaurant.rating.toFixed(1)}
            {" · "}
            리뷰 {restaurant.reviewCount.toLocaleString()}
            {" · "}
            {restaurant.distance}m
          </p>
        </div>

        {/* Desktop navigation */}
        {onPrevious && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onPrevious();
            }}
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur transition hover:bg-black/50"
            aria-label="이전 맛집"
          >
            ‹
          </button>
        )}

        {onNext && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onNext();
            }}
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur transition hover:bg-black/50"
            aria-label="다음 맛집"
          >
            ›
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 pt-3">
        <div className="flex items-center gap-4 text-2xl">
          <button type="button" aria-label="좋아요">
            ♡
          </button>

          <button type="button" aria-label="공유">
            ↗
          </button>
        </div>

        <button type="button" aria-label="저장">
          🔖
        </button>
      </div>

      {/* Description */}
      <div className="px-4 pb-4 pt-3">
        <p className="text-sm leading-6 text-gray-700">
          {restaurant.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {restaurant.menus.map((menu) => (
            <span
              key={menu}
              className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
            >
              #{menu}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={onOpenDetail}
          className="mt-4 w-full rounded-2xl bg-black py-3.5 text-sm font-bold text-white transition active:scale-[0.98]"
        >
          자세히 보기
        </button>
      </div>
    </div>
  );
}
