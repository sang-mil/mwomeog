import { Restaurant } from "@/types/restaurant";

export const mockRestaurants: Restaurant[] = [
  {
    id: "restaurant-001",
    source: "mock",
    name: "멘야 하루",
    category: "일식",
    rating: 4.8,
    reviewCount: 517,
    distance: 420,
    isOpen: true,
    closingTime: "22:00",
    imageUrl:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=85",
    address: "서울시 강남구 강남대로 456",
    menus: ["돈코츠 라멘", "쇼유 라멘", "교자"],
    description:
      "진한 돈코츠 육수와 쫄깃한 면이 인기인 작은 라멘 전문점.",
    latitude: 37.498,
    longitude: 127.027,
    mapPosition: {
      x: 57,
      y: 42,
    },
  },
  {
    id: "restaurant-002",
    source: "mock",
    name: "서울식당",
    category: "한식",
    rating: 4.6,
    reviewCount: 328,
    distance: 650,
    isOpen: true,
    closingTime: "21:30",
    imageUrl:
      "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=1200&q=85",
    address: "서울시 강남구 테헤란로 123",
    menus: ["김치찌개", "제육볶음", "된장찌개"],
    description:
      "집밥처럼 편안한 한식 메뉴와 푸짐한 양으로 유명한 동네 식당.",
    latitude: 37.5012,
    longitude: 127.0396,
    mapPosition: {
      x: 32,
      y: 54,
    },
  },
  {
    id: "restaurant-003",
    source: "mock",
    name: "치즈하우스",
    category: "양식",
    rating: 4.5,
    reviewCount: 241,
    distance: 880,
    isOpen: true,
    closingTime: "23:00",
    imageUrl:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=85",
    address: "서울시 강남구 논현로 101",
    menus: ["마르게리타 피자", "파스타", "샐러드"],
    description:
      "화덕 피자와 파스타를 함께 즐길 수 있는 캐주얼 이탈리안 레스토랑.",
    latitude: 37.507,
    longitude: 127.022,
    mapPosition: {
      x: 78,
      y: 32,
    },
  },
  {
    id: "restaurant-004",
    source: "mock",
    name: "골목 짜장",
    category: "중식",
    rating: 4.3,
    reviewCount: 192,
    distance: 1100,
    isOpen: false,
    closingTime: "20:00",
    imageUrl:
      "https://images.unsplash.com/photo-1583032015879-e5022cb87c3b?auto=format&fit=crop&w=1200&q=85",
    address: "서울시 강남구 역삼로 789",
    menus: ["짜장면", "짬뽕", "탕수육"],
    description:
      "오래된 동네 중국집 스타일의 진한 짜장과 바삭한 탕수육이 대표 메뉴.",
    latitude: 37.4987,
    longitude: 127.033,
    mapPosition: {
      x: 23,
      y: 28,
    },
  },
  {
    id: "restaurant-005",
    source: "mock",
    name: "소반집",
    category: "한식",
    rating: 4.7,
    reviewCount: 164,
    distance: 1450,
    isOpen: true,
    closingTime: "21:00",
    imageUrl:
      "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=85",
    address: "서울시 강남구 선릉로 321",
    menus: ["불고기", "비빔밥", "갈비찜"],
    description:
      "정갈한 반찬과 따뜻한 한식 한 상을 즐길 수 있는 식당.",
    latitude: 37.504,
    longitude: 127.041,
    mapPosition: {
      x: 72,
      y: 68,
    },
  },
];

export const foodCategories = [
  "전체",
  "한식",
  "중식",
  "일식",
  "양식",
  "치킨",
  "분식",
  "카페",
] as const;
