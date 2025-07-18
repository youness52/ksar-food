import { FlatList, StyleSheet, Text, TouchableOpacity, View, Platform } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Stack } from "expo-router";
import { Feather } from "@expo/vector-icons"; // ✅ Replaced lucide-react-native
import * as Haptics from "expo-haptics";

import CartItem from "@/components/CartItem";
import AuthGuard from "@/components/AuthGuard";
import { CartProvider, useCart } from "@/hooks/cart-store";
import Colors from "@/constants/colors";

function CartContent() {
  const router = useRouter();
  const { cart, orders, removeFromCart, updateQuantity, getCartTotal, placeOrder } = useCart();

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;

    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    const order = await placeOrder();

    if (order) {
      router.push(`/order/${order.id}`);
    }
  };

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.iconContainer}>
        <Feather name="shopping-bag" size={48} color={Colors.light.gray} /> {/* ✅ Updated icon */}
      </View>
      <Text style={styles.emptyTitle}>Your cart is empty</Text>
      <Text style={styles.emptyText}>
        Add items from restaurants to start an order
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => router.push("/")}
        testID="browse-restaurants-button"
      >
        <Text style={styles.browseButtonText}>Browse Restaurants</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Cart",
          headerStyle: {
            backgroundColor: Colors.light.background,
          },
          headerShadowVisible: false,
        }}
      />
      <View style={styles.container} testID="cart-screen">
        {cart.length === 0 ? (
          renderEmptyCart()
        ) : (
          <>
            <FlatList
              data={cart}
              keyExtractor={(item) => item.menuItem.id}
              renderItem={({ item }) => (
                <CartItem
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              )}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />

            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>
                  ${getCartTotal().toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={styles.summaryValue}>
                  ${cart[0]?.restaurantId ? "2.99" : "0.00"}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>
                  ${(getCartTotal() + (cart[0]?.restaurantId ? 2.99 : 0)).toFixed(2)}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={handlePlaceOrder}
                testID="place-order-button"
              >
                <Text style={styles.checkoutButtonText}>Place Order</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </>
  );
}

export default function CartScreen() {
  return (
    <AuthGuard>
      <CartProvider>
        <CartContent />
      </CartProvider>
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.lightGray,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.gray,
    textAlign: "center",
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  browseButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  summaryContainer: {
    backgroundColor: Colors.light.card,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: Colors.light.gray,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.primary,
  },
  checkoutButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
