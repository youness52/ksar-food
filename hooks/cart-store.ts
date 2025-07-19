import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect } from "react";

import { CartItem, Order, MenuItem } from "@/types/restaurant";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/auth-store";

export const [CartProvider, useCart] = createContextHook(() => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const queryClient = useQueryClient();

  const userId = user?.id;

  // Load cart from Supabase
  const cartQuery = useQuery({
    queryKey: ["cart", userId],
    queryFn: async () => {
      if (!userId) return [];

      try {
        const { data: cartItems, error } = await supabase
          .from("cart_items")
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
          .eq("user_id", userId);

        if (error) {
          console.error("Failed to load cart:", error);
          return [];
        }

        return cartItems.map((item: any) => ({
          menuItem: {
            id: item.menu_items.id,
            name: item.menu_items.name,
            description: item.menu_items.description,
            price: item.menu_items.price,
            image: item.menu_items.image,
            category: item.menu_items.category,
          },
          quantity: item.quantity,
          restaurantId: item.restaurant_id,
          restaurantName: item.restaurant_name,
        })) as CartItem[];
      } catch (error) {
        console.error("Failed to load cart:", error);
        return [];
      }
    },
    enabled: !!userId,
  });

  // Load orders from Supabase
  const ordersQuery = useQuery({
    queryKey: ["orders", userId],
    queryFn: async () => {
      if (!userId) return [];

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
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Failed to load orders:", error);
          return [];
        }

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
    enabled: !!userId,
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async (item: CartItem) => {
      if (!userId) throw new Error("User not authenticated");

      const { data: existingItem } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", userId)
        .eq("menu_item_id", item.menuItem.id)
        .single();

      if (existingItem) {
        const { error } = await supabase
          .from("cart_items")
          .update({ 
            quantity: existingItem.quantity + item.quantity,
            updated_at: new Date().toISOString()
          })
          .eq("id", existingItem.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("cart_items")
          .insert({
            user_id: userId,
            menu_item_id: item.menuItem.id,
            restaurant_id: item.restaurantId,
            restaurant_name: item.restaurantName,
            quantity: item.quantity,
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    },
  });

  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: async (menuItemId: string) => {
      if (!userId) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", userId)
        .eq("menu_item_id", menuItemId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    },
  });

  // Update quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ menuItemId, quantity }: { menuItemId: string; quantity: number }) => {
      if (!userId) throw new Error("User not authenticated");

      if (quantity <= 0) {
        const { error } = await supabase
          .from("cart_items")
          .delete()
          .eq("user_id", userId)
          .eq("menu_item_id", menuItemId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("cart_items")
          .update({ 
            quantity,
            updated_at: new Date().toISOString()
          })
          .eq("user_id", userId)
          .eq("menu_item_id", menuItemId);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    },
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    },
  });

  // Place orders mutation (handles multiple restaurants)
  const placeOrderMutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("User not authenticated");
      if (cart.length === 0) return [];

      // Group cart items by restaurantId
      const groupedItems = cart.reduce((groups, item) => {
        if (!groups[item.restaurantId]) groups[item.restaurantId] = [];
        groups[item.restaurantId].push(item);
        return groups;
      }, {} as Record<string, CartItem[]>);

      const createdOrders: Order[] = [];

      for (const restaurantId in groupedItems) {
        const itemsForRestaurant = groupedItems[restaurantId];
        const restaurantName = itemsForRestaurant[0].restaurantName;
        const total = itemsForRestaurant.reduce(
          (sum, item) => sum + item.menuItem.price * item.quantity,
          0
        );

        // Insert order
        const { data: order, error: orderError } = await supabase
          .from("orders")
          .insert({
            user_id: userId,
            restaurant_id: restaurantId,
            restaurant_name: restaurantName,
            status: "confirmed",
            total,
            delivery_fee: 2.99,
            estimated_delivery_time: "30-45 min",
          })
          .select()
          .single();

        if (orderError) throw orderError;

        // Insert order items
        const orderItems = itemsForRestaurant.map((item) => ({
          order_id: order.id,
          menu_item_id: item.menuItem.id,
          menu_item_name: item.menuItem.name,
          menu_item_price: item.menuItem.price,
          quantity: item.quantity,
        }));

        const { error: itemsError } = await supabase
          .from("order_items")
          .insert(orderItems);

        if (itemsError) throw itemsError;

        createdOrders.push({
          id: order.id,
          items: itemsForRestaurant,
          restaurantId,
          restaurantName,
          status: "confirmed",
          total,
          date: new Date(order.created_at),
          estimatedDeliveryTime: order.estimated_delivery_time,
        });
      }

      // Clear cart after all orders placed
      await clearCartMutation.mutateAsync();

      return createdOrders;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders", userId] });
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
    },
  });

  // Sync cart state with loaded data
  useEffect(() => {
    if (cartQuery.data) {
      setCart(cartQuery.data);
    }
  }, [cartQuery.data]);

  // Action functions
  const addToCart = (item: CartItem) => {
    if (!userId) return;
    addToCartMutation.mutate(item);
  };

  const removeFromCart = (itemId: string) => {
    if (!userId) return;
    removeFromCartMutation.mutate(itemId);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (!userId) return;
    updateQuantityMutation.mutate({ menuItemId: itemId, quantity });
  };

  const clearCart = () => {
    if (!userId) return;
    clearCartMutation.mutate();
  };

  const placeOrder = () => {
    if (!userId) return Promise.resolve(null);

    return new Promise<Order[] | null>((resolve) => {
      placeOrderMutation.mutate(undefined, {
        onSuccess: (orders) => resolve(orders),
        onError: () => resolve(null),
      });
    });
  };

  const getCartTotal = () => {
    return cart.reduce(
      (sum, item) => sum + item.menuItem.price * item.quantity,
      0
    );
  };

  return {
    cart,
    orders: ordersQuery.data || [],
    isLoading: cartQuery.isLoading || ordersQuery.isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    placeOrder,
    getCartTotal,
  };
});
