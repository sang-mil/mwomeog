"use client";

import { useState } from "react";
import Image from "next/image";
import { Restaurant } from "@/types/restaurant";
import { formatDistance } from "@/lib/restaurant/restaurantUtils";

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
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div className="w-full overflow-hidden rounded-[28px] bg-white shadow-2xl ring-1 ring-black/5">
      {/* Instagram Profile-style Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 p-[2px]">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-xs font-bold text-gray-900">
              🍴
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-extrabold text-gray-900">
                {restaurant.name}
              </p>
              <span className="text-[10px] font-bold text-blue-500">✓</span>
            </div>

            <p className="text-[11px] font-medium text-gray-400">
              내 위치에서 {formatDistance(restaurant.distance)} · {restaurant.category}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenDetail}
          className="text-xs font-bold text-gray-500 hover:text-black bg-gray-100 rounded-full px-2.5 py-1"
        >
          정보
        </button>
      </div>

      {/* Main Image with Reels/Story Vibe */}
      <div
        className="relative aspect-[4/4.3] w-full cursor-pointer overflow-hidden bg-gray-100"
        onClick={onOpenDetail}
      >
        <Image
          src={restaurant.imageUrl}
          alt={`${restaurant.name} 음식 사진`}
          fill
          sizes="(max-width: 768px) 100vw, 448px"
          className="object-cover"
          priority
        />

        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="rounded-full bg-black/60 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
            {restaurant.category}
          </span>

          <span
            className={`rounded-full px-3 py-1.5 text-xs font-bold text-white backdrop-blur ${
              restaurant.isOpen ? "bg-emerald-500/90" : "bg-gray-800/80"
            }`}
          >
            {restaurant.isOpen ? "영업 중" : "영업 종료"}
          </span>
        </div>

        {/* Content on Image */}
        <div className="absolute bottom-5 left-5 right-5 text-white">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-amber-400/90 px-1.5 py-0.5 text-xs font-black text-black">
              ⭐ {restaurant.rating.toFixed(1)}
            </span>
            <span className="text-xs font-medium text-white/80">
              리뷰 {restaurant.reviewCount.toLocaleString()}개
            </span>
          </div>

          <h2 className="mt-1 text-2xl font-black tracking-tight drop-shadow-md">
            {restaurant.name}
          </h2>

          <p className="mt-1 line-clamp-1 text-xs text-white/80 drop-shadow">
            📍 {restaurant.address}
          </p>
        </div>

        {/* Desktop Carousel Navigation */}
        {onPrevious && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrevious();
            }}
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
            aria-label="이전 맛집"
          >
            ‹
          </button>
        )}

        {onNext && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/60"
            aria-label="다음 맛집"
          >
            ›
          </button>
        )}
      </div>

      {/* Instagram-style Action Bar */}
      <div className="flex items-center justify-between px-4 pt-3">
        <div className="flex items-center gap-4 text-2xl">
          <button
            type="button"
            onClick={() => setLiked(!liked)}
            className={`transition transform active:scale-125 ${
              liked ? "text-red-500" : "text-gray-700"
            }`}
            aria-label="좋아요"
          >
            {liked ? "❤️" : "♡"}
          </button>

          <button
            type="button"
            onClick={() => {
              if (navigator.share) {
                void navigator.share({
                  title: restaurant.name,
                  text: `${restaurant.name} - ${restaurant.description}`,
                  url: window.location.href,
                });
              } else {
                void navigator.clipboard.writeText(window.location.href);
                alert("링크가 복사되었습니다!");
              }
            }}
            className="text-gray-700 hover:text-black transition"
            aria-label="공유"
          >
            ↗
          </button>
        </div>

        <button
          type="button"
          onClick={() => setBookmarked(!bookmarked)}
          className="text-2xl transition transform active:scale-125 text-gray-700"
          aria-label="저장"
        >
          {bookmarked ? "🏷️" : "🔖"}
        </button>
      </div>

      {/* Description & Tags */}
      <div className="px-4 pb-4 pt-2.5">
        <p className="text-xs leading-5 text-gray-700 line-clamp-2">
          <span className="font-bold text-gray-900 mr-1.5">{restaurant.name}</span>
          {restaurant.description}
        </p>

        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {restaurant.menus.map((menu) => (
            <span
              key={menu}
              className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600"
            >
              #{menu}
            </span>
          ))}
        </div>

        {/* CTA Button */}
        <button
          type="button"
          onClick={onOpenDetail}
          className="mt-3.5 w-full rounded-2xl bg-black py-3.5 text-xs font-bold text-white shadow transition active:scale-[0.98]"
        >
          상세 정보 및 찾아가기 ➔
        </button>
      </div>
    </div>
  );
}
