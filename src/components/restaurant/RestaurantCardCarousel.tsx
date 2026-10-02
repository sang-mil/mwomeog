"use client";

import { useMemo, useRef, useState } from "react";
import RestaurantCard from "./RestaurantCard";
import { Restaurant } from "@/types/restaurant";

interface RestaurantCardCarouselProps {
  restaurants: Restaurant[];
  selectedIndex: number;
  onChange: (index: number) => void;
  onOpenDetail: (restaurant: Restaurant) => void;
}

export default function RestaurantCardCarousel({
  restaurants,
  selectedIndex,
  onChange,
  onOpenDetail,
}: RestaurantCardCarouselProps) {
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);

  const dragStartX = useRef(0);
  const pointerId = useRef<number | null>(null);

  const currentIndex =
    restaurants.length === 0
      ? 0
      : Math.min(selectedIndex, restaurants.length - 1);

  const getWrappedIndex = (index: number) => {
    if (restaurants.length === 0) return 0;

    return (
      (index + restaurants.length) %
      restaurants.length
    );
  };

  const previousIndex = useMemo(
    () => getWrappedIndex(currentIndex - 1),
    [currentIndex, restaurants.length],
  );

  const nextIndex = useMemo(
    () => getWrappedIndex(currentIndex + 1),
    [currentIndex, restaurants.length],
  );

  const previousRestaurant =
    restaurants[previousIndex] ?? null;

  const currentRestaurant =
    restaurants[currentIndex] ?? null;

  const nextRestaurant =
    restaurants[nextIndex] ?? null;

  const goPrevious = () => {
    if (restaurants.length <= 1) return;

    onChange(previousIndex);
    setDragX(0);
  };

  const goNext = () => {
    if (restaurants.length <= 1) return;

    onChange(nextIndex);
    setDragX(0);
  };

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    pointerId.current = event.pointerId;
    dragStartX.current = event.clientX;
    setDragging(true);

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (!dragging) return;

    const delta = event.clientX - dragStartX.current;

    // 너무 과하게 움직이지 않도록 제한
    const limitedDelta = Math.max(
      -180,
      Math.min(180, delta),
    );

    setDragX(limitedDelta);
  };

  const handlePointerUp = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (!dragging) return;

    const delta = event.clientX - dragStartX.current;

    setDragging(false);
    pointerId.current = null;

    if (Math.abs(delta) > 70) {
      if (delta < 0) {
        goNext();
      } else {
        goPrevious();
      }

      return;
    }

    setDragX(0);
  };

  const handlePointerCancel = () => {
    setDragging(false);
    pointerId.current = null;
    setDragX(0);
  };

  if (!currentRestaurant) {
    return (
      <div className="rounded-[28px] bg-white p-8 text-center shadow-2xl">
        <div className="text-4xl">🥲</div>

        <h2 className="mt-3 text-lg font-black">
          조건에 맞는 맛집이 없어요
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          필터를 조금 넓혀보세요.
        </p>
      </div>
    );
  }

  const cardStyle = (
    position: "previous" | "current" | "next",
  ) => {
    if (position === "current") {
      const rotate = dragX / 22;

      return {
        transform: `translateX(${dragX}px) rotate(${rotate}deg) scale(1)`,
        opacity: 1,
        filter: "none",
        zIndex: 30,
      };
    }

    if (position === "previous") {
      const influence = Math.min(
        Math.abs(dragX) / 500,
        0.15,
      );

      return {
        transform: `translateX(calc(-54% + ${dragX * 0.28}px)) rotate(-7deg) scale(${0.82 + influence})`,
        opacity: 0.58 + influence,
        filter: "blur(1.5px) saturate(0.8)",
        zIndex: 10,
      };
    }

    const influence = Math.min(
      Math.abs(dragX) / 500,
      0.15,
    );

    return {
      transform: `translateX(calc(54% + ${dragX * 0.28}px)) rotate(7deg) scale(${0.82 + influence})`,
      opacity: 0.58 + influence,
      filter: "blur(1.5px) saturate(0.8)",
      zIndex: 10,
    };
  };

  return (
    <div
      className="relative mx-auto h-[620px] w-full max-w-[520px] overflow-hidden"
      style={{
        touchAction: "pan-y",
        userSelect: "none",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      {/* -------------------------------------------------- */}
      {/* Previous card */}
      {/* -------------------------------------------------- */}

      {restaurants.length > 1 && previousRestaurant && (
        <div
          className={`pointer-events-none absolute left-1/2 top-0 w-[82%] -translate-x-1/2 transform-gpu ${
            dragging ? "" : "transition-all duration-300 ease-out"
          }`}
          style={cardStyle("previous")}
        >
          <div className="relative overflow-hidden rounded-[28px]">
            <RestaurantCard
              restaurant={previousRestaurant}
              onOpenDetail={() => {}}
            />

            {/* Blind / blur overlay */}
            <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-r from-black/20 via-white/5 to-black/25" />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white/25 to-transparent" />
          </div>
        </div>
      )}

      {/* -------------------------------------------------- */}
      {/* Current card */}
      {/* -------------------------------------------------- */}

      <div
        className={`absolute left-1/2 top-0 w-[92%] -translate-x-1/2 transform-gpu ${
          dragging
            ? ""
            : "transition-transform duration-300 ease-out"
        }`}
        style={cardStyle("current")}
      >
        <div
          className={`relative ${
            dragging ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          <RestaurantCard
            restaurant={currentRestaurant}
            onPrevious={goPrevious}
            onNext={goNext}
            onOpenDetail={() =>
              onOpenDetail(currentRestaurant)
            }
          />

          {/* Drag hint */}
          {!dragging && (
            <div className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 rounded-full bg-black/35 px-3 py-1 text-[10px] font-semibold text-white backdrop-blur">
              ← 좌우로 넘겨보세요 →
            </div>
          )}
        </div>
      </div>

      {/* -------------------------------------------------- */}
      {/* Next card */}
      {/* -------------------------------------------------- */}

      {restaurants.length > 1 && nextRestaurant && (
        <div
          className={`pointer-events-none absolute left-1/2 top-0 w-[82%] -translate-x-1/2 transform-gpu ${
            dragging ? "" : "transition-all duration-300 ease-out"
          }`}
          style={cardStyle("next")}
        >
          <div className="relative overflow-hidden rounded-[28px]">
            <RestaurantCard
              restaurant={nextRestaurant}
              onOpenDetail={() => {}}
            />

            {/* Blind / blur overlay */}
            <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-l from-black/20 via-white/5 to-black/25" />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white/25 to-transparent" />
          </div>
        </div>
      )}

      {/* -------------------------------------------------- */}
      {/* Counter */}
      {/* -------------------------------------------------- */}

      <div className="absolute bottom-1 left-1/2 z-40 -translate-x-1/2 rounded-full bg-black/75 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur">
        {currentIndex + 1} / {restaurants.length}
      </div>
    </div>
  );
}
