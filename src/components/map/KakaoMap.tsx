"use client";

import { useEffect, useRef, useState } from "react";
import { Restaurant } from "@/types/restaurant";
import { loadKakaoMapSDK } from "@/lib/kakao/loadKakaoMap";

interface KakaoMapProps {
  restaurants: Restaurant[];
  selectedId: string | null;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  centerLatitude: number;
  centerLongitude: number;
  radiusKm: number;
}

export default function KakaoMap({
  restaurants,
  selectedId,
  onSelectRestaurant,
  centerLatitude,
  centerLongitude,
  radiusKm,
}: KakaoMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const overlaysRef = useRef<any[]>([]);
  const circleRef = useRef<any>(null);
  const myLocationOverlayRef = useRef<any>(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // 1. 지도 초기화
  useEffect(() => {
    let cancelled = false;

    async function initMap() {
      try {
        await loadKakaoMapSDK();
        if (cancelled || !containerRef.current) return;

        const options = {
          center: new window.kakao.maps.LatLng(centerLatitude, centerLongitude),
          level: radiusKm <= 1 ? 4 : radiusKm <= 2 ? 5 : 6,
        };

        const map = new window.kakao.maps.Map(containerRef.current, options);
        mapInstanceRef.current = map;
        setMapLoaded(true);
      } catch (err) {
        if (!cancelled) {
          setLoadError(
            err instanceof Error ? err.message : "카카오 지도를 불러오지 못했습니다."
          );
        }
      }
    }

    void initMap();

    return () => {
      cancelled = true;
    };
  }, []);

  // 2. 중심 좌표 및 줌 레벨 변경 대응
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    const center = new window.kakao.maps.LatLng(centerLatitude, centerLongitude);
    map.setCenter(center);

    const level = radiusKm <= 1 ? 4 : radiusKm <= 2 ? 5 : 6;
    map.setLevel(level);

    // 내 위치 마커 업데이트
    if (myLocationOverlayRef.current) {
      myLocationOverlayRef.current.setMap(null);
    }

    const myContent = document.createElement("div");
    myContent.className = "relative flex h-10 w-10 items-center justify-center";
    myContent.innerHTML = `
      <div class="absolute h-8 w-8 animate-ping rounded-full bg-blue-500/30"></div>
      <div class="relative h-4 w-4 rounded-full border-2 border-white bg-blue-600 shadow-md"></div>
    `;

    const myOverlay = new window.kakao.maps.CustomOverlay({
      position: center,
      content: myContent,
      yAnchor: 0.5,
      zIndex: 5,
    });
    myOverlay.setMap(map);
    myLocationOverlayRef.current = myOverlay;

    // 반경 원(Circle) 업데이트
    if (circleRef.current) {
      circleRef.current.setMap(null);
    }

    const circle = new window.kakao.maps.Circle({
      center,
      radius: radiusKm * 1000,
      strokeWeight: 1.5,
      strokeColor: "#3B82F6",
      strokeOpacity: 0.6,
      strokeStyle: "dashed",
      fillColor: "#93C5FD",
      fillOpacity: 0.12,
    });
    circle.setMap(map);
    circleRef.current = circle;
  }, [mapLoaded, centerLatitude, centerLongitude, radiusKm]);

  // 3. 맛집 마커들 렌더링
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // 기존 오버레이 제거
    overlaysRef.current.forEach((overlay) => overlay.setMap(null));
    overlaysRef.current = [];

    // 새 맛집 오버레이 등록
    restaurants.forEach((restaurant) => {
      const isSelected = restaurant.id === selectedId;
      const position = new window.kakao.maps.LatLng(restaurant.latitude, restaurant.longitude);

      const content = document.createElement("div");
      content.className = `cursor-pointer transition-transform duration-200 select-none ${
        isSelected ? "scale-110 z-30" : "hover:scale-105 z-10"
      }`;

      content.innerHTML = `
        <div class="overflow-hidden rounded-2xl border-2 shadow-xl ${
          isSelected
            ? "border-black bg-white ring-4 ring-black/20"
            : "border-white bg-white/95"
        }">
          <div class="relative h-10 w-10 overflow-hidden bg-gray-100">
            <img src="${restaurant.imageUrl}" alt="" class="h-full w-full object-cover" />
          </div>
          <div class="px-1.5 py-1 text-[9px] font-black text-gray-900 text-center">
            ⭐ ${restaurant.rating.toFixed(1)}
          </div>
        </div>
        <div class="mx-auto h-2 w-2 rotate-45 ${
          isSelected ? "bg-black" : "bg-white"
        } shadow-sm -mt-1"></div>
      `;

      content.onclick = (e) => {
        e.stopPropagation();
        onSelectRestaurant(restaurant);
      };

      const overlay = new window.kakao.maps.CustomOverlay({
        position,
        content,
        yAnchor: 1.1,
        zIndex: isSelected ? 40 : 20,
      });

      overlay.setMap(map);
      overlaysRef.current.push(overlay);
    });
  }, [mapLoaded, restaurants, selectedId, onSelectRestaurant]);

  if (loadError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-gray-100 p-6 text-center">
        <div className="text-4xl">⚠️</div>
        <h3 className="mt-3 text-base font-bold text-gray-800">
          카카오 지도를 불러오지 못했습니다
        </h3>
        <p className="mt-1 text-xs text-gray-500 max-w-xs">
          카카오 디벨로퍼스 사이트 도메인에 현재 접속 주소가 등록되어 있는지 확인해주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#e9eee8] backdrop-blur">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-black border-t-transparent" />
          <p className="mt-3 text-xs font-bold text-gray-600">
            실시간 카카오 지도 불러오는 중...
          </p>
        </div>
      )}
    </div>
  );
}
