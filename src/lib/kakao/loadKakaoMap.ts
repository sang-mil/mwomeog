/**
 * 카카오 지도 SDK 동적 로더
 */
let kakaoLoadPromise: Promise<void> | null = null;

export function loadKakaoMapSDK(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Cannot load Kakao Map SDK on server"));
  }

  // 이미 로드 완료된 경우
  if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
    return Promise.resolve();
  }

  if (kakaoLoadPromise) {
    return kakaoLoadPromise;
  }

  const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;
  if (!appKey) {
    return Promise.reject(new Error("NEXT_PUBLIC_KAKAO_MAP_API_KEY is not configured"));
  }

  kakaoLoadPromise = new Promise<void>((resolve, reject) => {
    // 기존 스크립트 태그가 이미 존재하는지 확인
    const existingScript = document.getElementById("kakao-map-sdk");
    if (existingScript) {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => resolve());
      } else {
        existingScript.addEventListener("load", () => {
          window.kakao.maps.load(() => resolve());
        });
        existingScript.addEventListener("error", () => {
          reject(new Error("Failed to load Kakao Maps SDK script"));
        });
      }
      return;
    }

    const script = document.createElement("script");
    script.id = "kakao-map-sdk";
    script.type = "text/javascript";
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&libraries=services,clusterer&autoload=false`;
    script.async = true;

    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          resolve();
        });
      } else {
        reject(new Error("window.kakao is not defined after script load"));
      }
    };

    script.onerror = () => {
      kakaoLoadPromise = null;
      reject(new Error("Failed to load Kakao Maps SDK script from server"));
    };

    document.head.appendChild(script);
  });

  return kakaoLoadPromise;
}
