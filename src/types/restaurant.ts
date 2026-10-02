export type RestaurantCategory =
  | "한식"
  | "중식"
  | "일식"
  | "양식"
  | "치킨"
  | "분식"
  | "카페"
  | "기타";

export type RestaurantSource =
  | "mock"
  | "kakao"
  | "naver"
  | "google";

export interface Restaurant {
  id: string;

  // 외부 서비스가 제공하는 원본 ID
  sourceId?: string;

  // 데이터 출처
  source: RestaurantSource;

  name: string;
  category: RestaurantCategory;

  rating: number;
  reviewCount: number;

  distance: number;

  isOpen: boolean;
  closingTime?: string;

  imageUrl: string;

  address: string;

  menus: string[];

  description: string;

  latitude: number;
  longitude: number;

  // 현재 가짜 지도 전용
  mapPosition: {
    x: number;
    y: number;
  };
}
