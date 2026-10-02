"use client";

import MockMap from "./MockMap";
import { Restaurant } from "@/types/restaurant";

interface RestaurantMapProps {
  restaurants: Restaurant[];
  selectedId: string | null;
  onSelectRestaurant: (restaurant: Restaurant) => void;
}

export default function RestaurantMap(props: RestaurantMapProps) {
  return <MockMap {...props} />;
}
