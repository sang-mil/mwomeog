import { MockRestaurantProvider } from "./mockProvider";
import { RestaurantProvider } from "./types";

const providers: Record<
  string,
  RestaurantProvider
> = {
  mock: new MockRestaurantProvider(),
};

export function registerRestaurantProvider(
  provider: RestaurantProvider,
) {
  providers[provider.id] = provider;
}

export function getRestaurantProvider(
  id: string,
): RestaurantProvider {
  const provider = providers[id];

  if (!provider) {
    throw new Error(
      `Restaurant provider "${id}" is not registered.`,
    );
  }

  return provider;
}

export function getAvailableRestaurantProviders() {
  return Object.values(providers).map(
    (provider) => ({
      id: provider.id,
      name: provider.name,
    }),
  );
}
