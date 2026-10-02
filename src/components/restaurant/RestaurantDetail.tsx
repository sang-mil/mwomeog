"use client";

import Image from "next/image";
import { Restaurant } from "@/types/restaurant";

interface RestaurantDetailProps {
  restaurant: Restaurant;
  onClose: () => void;
}

export default function RestaurantDetail({
  restaurant,
  onClose,
}: RestaurantDetailProps) {
  return (
    <div className="absolute inset-0 z-[60] flex items-end bg-black/30 backdrop-blur-[2px]">
      <div className="max-h-[88vh] w-full overflow-y-auto rounded-t-[32px] bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between bg-white/90 px-5 py-4 backdrop-blur">
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100"
          >
            ↓
          </button>

          <p className="text-sm font-bold text-gray-900">
            맛집 상세
          </p>

          <button
            type="button"
            className="text-xl text-gray-400"
            aria-label="더보기"
          >
            •••
          </button>
        </div>

        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={restaurant.imageUrl}
            alt={`${restaurant.name} 대표 사진`}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <div className="px-5 pb-8 pt-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-400">
                {restaurant.category}
              </p>

              <h2 className="mt-1 text-3xl font-black tracking-tight text-gray-900">
                {restaurant.name}
              </h2>
            </div>

            <div className="rounded-2xl bg-gray-100 px-3 py-2 text-center">
              <div className="text-sm font-black text-gray-900">
                ⭐ {restaurant.rating.toFixed(1)}
              </div>

              <div className="text-[10px] text-gray-400">
                {restaurant.reviewCount.toLocaleString()} 리뷰
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            <div className="rounded-2xl bg-gray-50 p-3">
              <p className="text-[10px] text-gray-400">거리</p>
              <p className="mt-1 text-sm font-bold">
                {restaurant.distance}m
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-3">
              <p className="text-[10px] text-gray-400">상태</p>
              <p className="mt-1 text-sm font-bold">
                {restaurant.isOpen ? "영업 중" : "영업 종료"}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-3">
              <p className="text-[10px] text-gray-400">종료</p>
              <p className="mt-1 text-sm font-bold">
                {restaurant.closingTime ?? "-"}
              </p>
            </div>
          </div>

          <p className="mt-6 text-sm leading-7 text-gray-600">
            {restaurant.description}
          </p>

          <div className="mt-6">
            <p className="text-sm font-bold text-gray-900">
              대표 메뉴
            </p>

            <div className="mt-3 space-y-2">
              {restaurant.menus.map((menu, index) => (
                <div
                  key={menu}
                  className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3"
                >
                  <span className="text-sm text-gray-700">
                    {menu}
                  </span>

                  <span className="text-xs text-gray-400">
                    #{index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-gray-50 p-4">
            <p className="text-xs text-gray-400">주소</p>

            <p className="mt-1 text-sm font-semibold text-gray-800">
              📍 {restaurant.address}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              window.alert(
                "실제 지도 API 연결 후 길찾기 서비스로 연결됩니다.",
              )
            }
            className="mt-6 w-full rounded-2xl bg-black py-4 text-sm font-bold text-white"
          >
            찾아가기
          </button>
        </div>
      </div>
    </div>
  );
}
