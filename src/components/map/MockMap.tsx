"use client";

import Image from "next/image";
import { Restaurant } from "@/types/restaurant";
import MapMarker from "./MapMarker";

interface MockMapProps {
  restaurants: Restaurant[];
  selectedId: string | null;
  onSelectRestaurant: (restaurant: Restaurant) => void;
}

export default function MockMap({
  restaurants,
  selectedId,
  onSelectRestaurant,
}: MockMapProps) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#e9eee8]">
      <div className="absolute inset-0 bg-[#e8ede7]" />

      {/* 공원 */}
      <div className="absolute left-[4%] top-[11%] h-[24%] w-[25%] rounded-[28px] bg-[#d7e8d2]" />
      <div className="absolute right-[4%] top-[55%] h-[20%] w-[25%] rounded-[28px] bg-[#d8e8d5]" />

      {/* 물 */}
      <div className="absolute -right-[10%] top-0 h-full w-[14%] rotate-[8deg] bg-[#d4e6ef]" />

      {/* 큰 도로 */}
      <div className="absolute left-0 top-[22%] h-[34px] w-full bg-white shadow-sm" />
      <div className="absolute left-0 top-[51%] h-[46px] w-full bg-white shadow-sm" />
      <div className="absolute left-0 top-[76%] h-[26px] w-full bg-white shadow-sm" />

      <div className="absolute left-[17%] top-0 h-full w-[34px] bg-white shadow-sm" />
      <div className="absolute left-[51%] top-0 h-full w-[48px] bg-white shadow-sm" />
      <div className="absolute left-[79%] top-0 h-full w-[28px] bg-white shadow-sm" />

      {/* 작은 도로 */}
      <div className="absolute left-[37%] top-0 h-full w-[8px] rotate-[8deg] bg-[#dfe4df]" />
      <div className="absolute left-0 top-[39%] h-[8px] w-full rotate-[-5deg] bg-[#dfe4df]" />
      <div className="absolute left-0 top-[67%] h-[7px] w-full rotate-[7deg] bg-[#dfe4df]" />

      {/* 건물 */}
      <div className="absolute left-[30%] top-[7%] h-10 w-16 rounded-lg bg-[#dce1dc]" />
      <div className="absolute left-[65%] top-[10%] h-12 w-20 rounded-lg bg-[#dfe4df]" />
      <div className="absolute left-[4%] top-[42%] h-16 w-20 rounded-lg bg-[#dfe2de]" />
      <div className="absolute left-[63%] top-[41%] h-12 w-16 rounded-lg bg-[#dfe2de]" />
      <div className="absolute left-[33%] top-[60%] h-14 w-20 rounded-lg bg-[#dce1dc]" />
      <div className="absolute left-[54%] top-[79%] h-14 w-24 rounded-lg bg-[#dfe2de]" />

      {/* 지도 텍스트 */}
      <div className="absolute left-[8%] top-[17%] text-[11px] font-medium text-[#71806f]">
        중앙공원
      </div>

      <div className="absolute left-[34%] top-[45%] text-[10px] font-medium text-[#919b90]">
        먹자골목
      </div>

      <div className="absolute right-[12%] top-[61%] text-[10px] font-medium text-[#71806f]">
        카페거리
      </div>

      <div className="absolute left-[56%] top-[13%] rotate-90 text-[10px] font-medium text-[#a1aaa0]">
        테헤란로
      </div>

      {/* 현재 위치 */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/15">
          <div className="absolute h-6 w-6 animate-pulse rounded-full bg-blue-500/20" />
          <div className="relative h-4 w-4 rounded-full border-[3px] border-white bg-blue-500 shadow-lg" />
        </div>
      </div>

      {/* 맛집 핀 */}
      {restaurants.map((restaurant) => (
        <MapMarker
          key={restaurant.id}
          restaurant={restaurant}
          isSelected={restaurant.id === selectedId}
          onClick={() => onSelectRestaurant(restaurant)}
        />
      ))}
    </div>
  );
}
