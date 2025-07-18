import { useQuery } from "@tanstack/react-query";
import createContextHook from "@nkzw/create-context-hook";

import { Restaurant, Category } from "@/types/restaurant";
import { supabase } from "@/lib/supabase";

export const [RestaurantsProvider, useRestaurants] = createContextHook(() => {
  // Load restaurants from Supabase
  const restaurantsQuery = useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      try {
        const { data: restaurants, error } = await supabase
          .from("restaurants")
          .select(`
            *,
            menu_items (
              id,
              name,
              description,
              price,
              image,
              category
            )
          `);

        if (error) {
          console.error("Failed to load restaurants:", error);
          return [];
        }

        return restaurants.map((restaurant: any) => ({
          id: restaurant.id,
          name: restaurant.name,
          image: restaurant.image,
          rating: restaurant.rating,
          deliveryTime: restaurant.delivery_time,
          deliveryFee: restaurant.delivery_fee,
          categories: restaurant.categories,
          menu: restaurant.menu_items.map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            image: item.image,
            category: item.category,
          })),
        })) as Restaurant[];
      } catch (error) {
        console.error("Failed to load restaurants:", error);
        return [];
      }
    },
  });

  // Load categories from Supabase
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const { data: categories, error } = await supabase
          .from("categories")
          .select("*");

        if (error) {
          console.error("Failed to load categories:", error);
          return [];
        }

        return categories as Category[];
      } catch (error) {
        console.error("Failed to load categories:", error);
        return [];
      }
    },
  });

  return {
    restaurants: restaurantsQuery.data || [],
    categories: categoriesQuery.data || [],
    isLoading: restaurantsQuery.isLoading || categoriesQuery.isLoading,
    error: restaurantsQuery.error || categoriesQuery.error,
  };
});