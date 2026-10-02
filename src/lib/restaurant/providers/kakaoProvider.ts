import { Restaurant, RestaurantCategory } from "@/types/restaurant";
import { RestaurantProvider, RestaurantSearchParams } from "./types";
import { loadKakaoMapSDK } from "@/lib/kakao/loadKakaoMap";

// 카테고리별 고화질 대표 음식 사진 풀
const CATEGORY_IMAGES: Record<RestaurantCategory, string[]> = {
  한식: [
    "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=1200&q=85",
  ],
  일식: [
    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=1200&q=85",
  ],
  중식: [
    "https://images.unsplash.com/photo-1583032015879-e5022cb87c3b?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=1200&q=85",
  ],
  양식: [
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=85",
  ],
  치킨: [
    "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=1200&q=85",
  ],
  분식: [
    "https://images.unsplash.com/photo-1625938145744-e380515399b7?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1607301406259-dfb186e15de8?auto=format&fit=crop&w=1200&q=85",
  ],
  카페: [
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=85",
  ],
  기타: [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=85",
  ],
};

function parseKakaoCategory(categoryName: string): RestaurantCategory {
  if (categoryName.includes("한식")) return "한식";
  if (categoryName.includes("중식") || categoryName.includes("중화요리")) return "중식";
  if (categoryName.includes("일식") || categoryName.includes("초밥") || categoryName.includes("돈까스")) return "일식";
  if (categoryName.includes("양식") || categoryName.includes("이탈리안") || categoryName.includes("피자") || categoryName.includes("패밀리레스토랑")) return "양식";
  if (categoryName.includes("치킨")) return "치킨";
  if (categoryName.includes("분식")) return "분식";
  if (categoryName.includes("카페") || categoryName.includes("디저트") || categoryName.includes("커피")) return "카페";
  return "한식";
}

function getRandomImage(category: RestaurantCategory, seed: number): string {
  const images = CATEGORY_IMAGES[category] || CATEGORY_IMAGES["한식"];
  return images[seed % images.length];
}

export class KakaoRestaurantProvider implements RestaurantProvider {
  readonly id = "kakao";
  readonly name = "Kakao Local API";

  async searchNearby(params: RestaurantSearchParams): Promise<Restaurant[]> {
    await loadKakaoMapSDK();

    const { latitude, longitude, radiusKm, category = "전체", limit = 30 } = params;

    return new Promise<Restaurant[]>((resolve) => {
      const ps = new window.kakao.maps.services.Places();
      const center = new window.kakao.maps.LatLng(latitude, longitude);
      const radiusMeters = Math.min(Math.round(radiusKm * 1000), 20000);

      const callback = (data: any[], status: any) => {
        if (status !== window.kakao.maps.services.Status.OK || !Array.isArray(data)) {
          resolve([]);
          return;
        }

        const mapped: Restaurant[] = data.map((place, idx) => {
          const cat = parseKakaoCategory(place.category_name || "");
          const placeLat = parseFloat(place.y);
          const placeLng = parseFloat(place.x);
          const dist = parseInt(place.distance, 10) || Math.round(
            Math.sqrt((placeLat - latitude) ** 2 + (placeLng - longitude) ** 2) * 111000
          );

          // 평점 및 리뷰 수 (현실적인 더미 수치 부여)
          const baseHash = (place.id.split("").reduce((acc: number, c: string) => acc + c.charCodeAt(0), 0) + idx);
          const rating = Number((4.2 + (baseHash % 8) * 0.1).toFixed(1));
          const reviewCount = 50 + (baseHash % 900);

          return {
            id: `kakao-${place.id}`,
            sourceId: place.id,
            source: "kakao",
            name: place.place_name,
            category: cat,
            rating,
            reviewCount,
            distance: dist,
            isOpen: true,
            closingTime: "22:00",
            imageUrl: getRandomImage(cat, baseHash),
            address: place.road_address_name || place.address_name || "주소 정보 없음",
            menus: [place.place_name, `${cat} 대표 요리`, "인기 메뉴"],
            description: `${place.road_address_name || place.address_name}에 위치한 ${cat} 전문점. 카카오맵 평점과 방문자 리뷰가 좋은 인기 맛집입니다.`,
            latitude: placeLat,
            longitude: placeLng,
            mapPosition: {
              x: 50,
              y: 50,
            },
          };
        });

        // 거리순 정렬 후 limit 제한
        const sorted = mapped.sort((a, b) => a.distance - b.distance).slice(0, limit);
        resolve(sorted);
      };

      const options = {
        location: center,
        radius: radiusMeters,
        sort: window.kakao.maps.services.SortBy.DISTANCE,
      };

      if (category === "전체") {
        ps.categorySearch("FD6", callback, options);
      } else if (category === "카페") {
        ps.categorySearch("CE7", callback, options);
      } else {
        ps.keywordSearch(category, callback, {
          ...options,
          category_group_code: "FD6",
        });
      }
    });
  }
}
