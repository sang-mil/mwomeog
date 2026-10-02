"use client";

import { useState } from "react";
import Image from "next/image";
import { Restaurant } from "@/types/restaurant";
import {
  formatDistance,
  getMapNavigationLinks,
  getCrossCheckedOpenStatus,
} from "@/lib/restaurant/restaurantUtils";

interface RestaurantDetailProps {
  restaurant: Restaurant;
  onClose: () => void;
}

export default function RestaurantDetail({
  restaurant,
  onClose,
}: RestaurantDetailProps) {
  const [showNavSheet, setShowNavSheet] = useState(false);
  const mapLinks = getMapNavigationLinks(restaurant);
  const crossChecks = getCrossCheckedOpenStatus(restaurant);

  return (
    <div className="absolute inset-0 z-[60] flex items-end bg-black/40 backdrop-blur-[2px]">
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-[32px] bg-white shadow-2xl">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between bg-white/90 px-5 py-4 backdrop-blur">
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700"
          >
            ✕
          </button>

          <p className="text-sm font-bold text-gray-900">맛집 상세</p>

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
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm text-gray-700"
            aria-label="공유"
          >
            ↗
          </button>
        </div>

        {/* Cover image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
          <Image
            src={restaurant.imageUrl}
            alt={`${restaurant.name} 대표 사진`}
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <span className="absolute bottom-3 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-gray-900 shadow">
            {restaurant.category}
          </span>
        </div>

        <div className="px-5 pb-8 pt-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-gray-900">
                {restaurant.name}
              </h2>
              <p className="mt-1 text-xs text-gray-400">
                📍 {restaurant.address}
              </p>
            </div>

            <div className="rounded-2xl bg-amber-50 px-3 py-2 text-center ring-1 ring-amber-200">
              <div className="text-base font-black text-amber-600">
                ⭐ {restaurant.rating.toFixed(1)}
              </div>
              <div className="text-[10px] font-bold text-gray-400">
                리뷰 {restaurant.reviewCount.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Quick info badges */}
          <div className="mt-5 grid grid-cols-3 gap-2">
            <div className="rounded-2xl bg-gray-50 p-3 text-center">
              <p className="text-[10px] font-bold text-gray-400">거리</p>
              <p className="mt-0.5 text-sm font-extrabold text-gray-900">
                {formatDistance(restaurant.distance)}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-3 text-center">
              <p className="text-[10px] font-bold text-gray-400">영업 상태</p>
              <p
                className={`mt-0.5 text-sm font-extrabold ${
                  restaurant.isOpen ? "text-emerald-600" : "text-gray-400"
                }`}
              >
                {restaurant.isOpen ? "영업 중" : "영업 종료"}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-3 text-center">
              <p className="text-[10px] font-bold text-gray-400">마감 시간</p>
              <p className="mt-0.5 text-sm font-extrabold text-gray-900">
                {restaurant.closingTime ?? "-"}
              </p>
            </div>
          </div>

          {/* 지도 어플 영업시간 교차 확인 (기획서 요구사항) */}
          <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50/80 p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
              <span>🔍</span>
              <span>지도 앱 교차 확인 정보</span>
            </div>
            <div className="mt-2 space-y-1.5">
              {crossChecks.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs text-gray-600"
                >
                  <span className="font-medium text-gray-500">{item.source}</span>
                  <span className="font-semibold text-emerald-600">{item.timeText}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-5 text-sm leading-6 text-gray-600">
            {restaurant.description}
          </p>

          {/* Menus */}
          <div className="mt-6">
            <p className="text-sm font-bold text-gray-900">대표 메뉴</p>
            <div className="mt-2.5 space-y-2">
              {restaurant.menus.map((menu, index) => (
                <div
                  key={menu}
                  className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3"
                >
                  <span className="text-sm font-medium text-gray-800">
                    {menu}
                  </span>
                  <span className="rounded-full bg-gray-200/80 px-2 py-0.5 text-[10px] font-bold text-gray-500">
                    #{index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 찾아가기 버튼 */}
          <button
            type="button"
            onClick={() => setShowNavSheet(true)}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-black py-4 text-base font-bold text-white shadow-xl transition active:scale-[0.98]"
          >
            <span>🧭</span>
            <span>찾아가기 (지도 앱 연결)</span>
          </button>
        </div>

        {/* 찾아가기 지도 앱 선택 모달 */}
        {showNavSheet && (
          <div className="fixed inset-0 z-[70] flex items-end bg-black/50 p-4">
            <div className="w-full rounded-[28px] bg-white p-5 shadow-2xl animate-slideUp">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-gray-900 text-lg">
                  어떤 지도 앱으로 갈까요?
                </h3>
                <button
                  type="button"
                  onClick={() => setShowNavSheet(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500"
                >
                  ✕
                </button>
              </div>

              <p className="mt-1 text-xs text-gray-400">
                선택하신 지도 앱에서 바로 길안내를 시작합니다.
              </p>

              <div className="mt-4 grid gap-2.5">
                {mapLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4 font-bold text-gray-900 transition hover:bg-gray-100 active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{link.icon}</span>
                      <span>{link.name}</span>
                    </div>
                    <span className="text-xs text-gray-400">길찾기 ➔</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
