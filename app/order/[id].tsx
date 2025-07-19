import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Feather } from "@expo/vector-icons";

import OrderStatusCard from "@/components/OrderStatusCard";
import AuthGuard from "@/components/AuthGuard";
import { CartProvider, useCart } from "@/hooks/cart-store";
import Colors from "@/constants/colors";

function OrderContent() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { orders } = useCart();

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Order not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/")}
          testID="home-button"
        >
          <Text style={styles.backButtonText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Order Tracking",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerBackButton}
              testID="header-back-button"
            >
              <Feather name="chevron-left" size={24} color={Colors.light.text} />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: Colors.light.background,
          },
        }}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        testID="order-screen"
      >
        <OrderStatusCard order={order} />

        <View style={styles.deliveryAddressContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
          </View>
          <View style={styles.addressCard}>
            <View style={styles.addressIconContainer}>
              <Feather name="map-pin" size={20} color={Colors.light.primary} />
            </View>
            <View style={styles.addressDetails}>
              <Text style={styles.addressTitle}>Home</Text>
              <Text style={styles.addressText}>
                123 Main Street, Apt 4B, New York, NY 10001
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.orderDetailsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Order Details</Text>
            <Text style={styles.orderNumber}>#{order.id.split("-")[1]}</Text>
          </View>

          <View style={styles.orderItemsContainer}>
            {order.items.map((item) => (
              <View key={item.menuItem.id} style={styles.orderItem}>
                <View style={styles.orderItemDetails}>
                  <Text style={styles.orderItemQuantity}>{item.quantity}x</Text>
                  <Text style={styles.orderItemName}>{item.menuItem.name}</Text>
                </View>
                <Text style={styles.orderItemPrice}>
                  ${(item.menuItem.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          <View style={styles.orderSummary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>
                ${order.total.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>$2.99</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                ${(order.total + 2.99).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.supportButton}
          onPress={() => {}}
          testID="support-button"
        >
          <Text style={styles.supportButtonText}>Contact Support</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

export default function OrderScreen() {
  return (
    <AuthGuard>
      <CartProvider>
        <OrderContent />
      </CartProvider>
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingTop:30,
  },
  contentContainer: {
    padding: 16,
  },
  headerBackButton: {
    marginLeft: 8,
  },
  deliveryAddressContainer: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  orderNumber: {
    fontSize: 14,
    color: Colors.light.gray,
  },
  addressCard: {
    flexDirection: "row",
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  addressIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.lightGray,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  addressDetails: {
    flex: 1,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: Colors.light.gray,
  },
  orderDetailsContainer: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderItemsContainer: {
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  orderItemDetails: {
    flexDirection: "row",
  },
  orderItemQuantity: {
    fontSize: 16,
    fontWeight: "500",
    marginRight: 8,
    color: Colors.light.primary,
  },
  orderItemName: {
    fontSize: 16,
  },
  orderItemPrice: {
    fontSize: 16,
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginBottom: 16,
  },
  orderSummary: {},
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
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.primary,
  },
  supportButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  supportButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
