"use client";

import Image from "next/image";
import { Restaurant } from "@/types/restaurant";

interface MapMarkerProps {
  restaurant: Restaurant;
  isSelected: boolean;
  onClick: () => void;
}

export default function MapMarker({
  restaurant,
  isSelected,
  onClick,
}: MapMarkerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
      style={{
        left: `${restaurant.mapPosition.x}%`,
        top: `${restaurant.mapPosition.y}%`,
        zIndex: isSelected ? 30 : 10,
        transform: `translate(-50%, -50%) scale(${isSelected ? 1.1 : 1})`,
      }}
      aria-label={`${restaurant.name} 선택`}
    >
      <div
        className={`overflow-hidden rounded-2xl border-2 shadow-lg ${
          isSelected
            ? "border-black bg-white ring-4 ring-white/70"
            : "border-white bg-white"
        }`}
      >
        <div className="relative h-10 w-10 overflow-hidden">
          <Image
            src={restaurant.imageUrl}
            alt=""
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>

        <div className="px-1.5 py-1 text-[9px] font-bold text-gray-900">
          ⭐ {restaurant.rating.toFixed(1)}
        </div>
      </div>

      <div className="mx-auto h-2 w-2 rotate-45 bg-white shadow-sm" />
    </button>
  );
}
