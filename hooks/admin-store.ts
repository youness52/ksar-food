import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import createContextHook from "@nkzw/create-context-hook";

import { Restaurant, Order } from "@/types/restaurant";
import { User } from "@/hooks/auth-store";
import { supabase } from "@/lib/supabase";

interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalRestaurants: number;
}

// Admin Stats Hook
export const useAdminStats = () => {
  const statsQuery = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async (): Promise<AdminStats> => {
      try {
        // Get total revenue and orders
        const { data: orders, error: ordersError } = await supabase
          .from("orders")
          .select("total");

        if (ordersError) throw ordersError;

        // Get total users
        const { data: users, error: usersError } = await supabase
          .from("users")
          .select("id");

        if (usersError) throw usersError;

        // Get total restaurants
        const { data: restaurants, error: restaurantsError } = await supabase
          .from("restaurants")
          .select("id");

        if (restaurantsError) throw restaurantsError;

        const totalRevenue = orders?.reduce((sum, order) => sum + order.total, 0) || 0;
        const totalOrders = orders?.length || 0;
        const totalUsers = users?.length || 0;
        const totalRestaurants = restaurants?.length || 0;

        return {
          totalRevenue,
          totalOrders,
          totalUsers,
          totalRestaurants,
        };
      } catch (error) {
        console.error("Failed to load admin stats:", error);
        return {
          totalRevenue: 0,
          totalOrders: 0,
          totalUsers: 0,
          totalRestaurants: 0,
        };
      }
    },
  });

  return {
    stats: statsQuery.data,
    isLoading: statsQuery.isLoading,
    error: statsQuery.error,
  };
};

// Admin Restaurants Hook
export const useAdminRestaurants = () => {
  const queryClient = useQueryClient();

  const restaurantsQuery = useQuery({
    queryKey: ["admin-restaurants"],
    queryFn: async (): Promise<Restaurant[]> => {
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
          `)
          .order("created_at", { ascending: false });

        if (error) throw error;

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

  const deleteRestaurantMutation = useMutation({
    mutationFn: async (restaurantId: string) => {
      const { error } = await supabase
        .from("restaurants")
        .delete()
        .eq("id", restaurantId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-restaurants"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });

  return {
    restaurants: restaurantsQuery.data || [],
    isLoading: restaurantsQuery.isLoading,
    error: restaurantsQuery.error,
    deleteRestaurant: deleteRestaurantMutation.mutate,
  };
};

// Admin Orders Hook
export const useAdminOrders = () => {
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async (): Promise<Order[]> => {
      try {
        const { data: orders, error } = await supabase
          .from("orders")
          .select(`
            *,
            order_items (
              id,
              menu_item_id,
              menu_item_name,
              menu_item_price,
              quantity
            )
          `)
          .order("created_at", { ascending: false });

        if (error) throw error;

        return orders.map((order: any) => ({
          id: order.id,
          items: order.order_items.map((item: any) => ({
            menuItem: {
              id: item.menu_item_id,
              name: item.menu_item_name,
              description: "",
              price: item.menu_item_price,
              image: "",
              category: "",
            },
            quantity: item.quantity,
            restaurantId: order.restaurant_id,
            restaurantName: order.restaurant_name,
          })),
          restaurantId: order.restaurant_id,
          restaurantName: order.restaurant_name,
          status: order.status,
          total: order.total,
          date: new Date(order.created_at),
          estimatedDeliveryTime: order.estimated_delivery_time,
        })) as Order[];
      } catch (error) {
        console.error("Failed to load orders:", error);
        return [];
      }
    },
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const { error } = await supabase
        .from("orders")
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq("id", orderId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });

  return {
    orders: ordersQuery.data || [],
    isLoading: ordersQuery.isLoading,
    error: ordersQuery.error,
    updateOrderStatus: (orderId: string, status: string) => 
      updateOrderStatusMutation.mutate({ orderId, status }),
  };
};

// Admin Users Hook
export const useAdminUsers = () => {
  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: ["admin-users"],
    queryFn: async (): Promise<User[]> => {
      try {
        const { data: users, error } = await supabase
          .from("users")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        return users as User[];
      } catch (error) {
        console.error("Failed to load users:", error);
        return [];
      }
    },
  });

  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: 'user' | 'admin' }) => {
      const { error } = await supabase
        .from("users")
        .update({ 
          role,
          updated_at: new Date().toISOString()
        })
        .eq("id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  return {
    users: usersQuery.data || [],
    isLoading: usersQuery.isLoading,
    error: usersQuery.error,
    updateUserRole: (userId: string, role: 'user' | 'admin') => 
      updateUserRoleMutation.mutate({ userId, role }),
  };
};