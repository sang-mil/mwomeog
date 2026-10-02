import { Restaurant } from "@/types/restaurant";

/**
 * 거리를 보기 좋은 문자열(m 또는 km)로 변환
 */
export function formatDistance(distanceMeters: number): string {
  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)}m`;
  }
  return `${(distanceMeters / 1000).toFixed(1)}km`;
}

export interface MapLinkInfo {
  name: string;
  url: string;
  icon: string;
  color: string;
}

/**
 * 카카오맵, 네이버지도, 구글지도 길찾기 링크 목록 생성
 */
export function getMapNavigationLinks(restaurant: Restaurant): MapLinkInfo[] {
  const { name, latitude, longitude } = restaurant;
  const encodedName = encodeURIComponent(name);

  return [
    {
      name: "카카오맵",
      url: `https://map.kakao.com/link/to/${encodedName},${latitude},${longitude}`,
      icon: "🟡",
      color: "#FEE500",
    },
    {
      name: "네이버 지도",
      url: `https://map.naver.com/p/search/${encodedName}`,
      icon: "🟢",
      color: "#03C75A",
    },
    {
      name: "구글 지도",
      url: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
      icon: "🔵",
      color: "#4285F4",
    },
  ];
}

/**
 * 여러 지도 앱(네이버, 카카오) 영업 정보 교차 확인 모의 데이터 생성
 */
export interface CrossCheckStatus {
  source: string;
  isOpen: boolean;
  timeText: string;
  verified: boolean;
}

export function getCrossCheckedOpenStatus(restaurant: Restaurant): CrossCheckStatus[] {
  return [
    {
      source: "카카오맵",
      isOpen: restaurant.isOpen,
      timeText: restaurant.isOpen ? `영업 중 (${restaurant.closingTime ?? "22:00"} 마감)` : "영업 종료",
      verified: true,
    },
    {
      source: "네이버 플레이스",
      isOpen: restaurant.isOpen,
      timeText: restaurant.isOpen ? `영업 중` : "정기 휴무/마감",
      verified: true,
    },
  ];
}
