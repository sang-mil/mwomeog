import { MockRestaurantProvider } from "./mockProvider";
import { KakaoRestaurantProvider } from "./kakaoProvider";
import { RestaurantProvider } from "./types";

const providers: Record<string, RestaurantProvider> = {
  mock: new MockRestaurantProvider(),
  kakao: new KakaoRestaurantProvider(),
};

export function registerRestaurantProvider(provider: RestaurantProvider) {
  providers[provider.id] = provider;
}

export function getRestaurantProvider(id: string): RestaurantProvider {
  const provider = providers[id];

  if (!provider) {
    // kakao가 없을 때 mock으로 안전하게 fallback
    if (providers.mock) return providers.mock;
    throw new Error(`Restaurant provider "${id}" is not registered.`);
  }

  return provider;
}

export function getAvailableRestaurantProviders() {
  return Object.values(providers).map((provider) => ({
    id: provider.id,
    name: provider.name,
  }));
}
