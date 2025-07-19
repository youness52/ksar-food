import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import React from "react";
import { Stack, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

import Colors from "@/constants/colors";
import AuthGuard from "@/components/AuthGuard";
import { CartProvider, useCart } from "@/hooks/cart-store";

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Feather name="check-circle" size={20} color={Colors.light.success} />;
      case "preparing":
        return <Feather name="coffee" size={20} color={Colors.light.primary} />; // ChefHat replaced with coffee icon
      case "on-the-way":
        return <Feather name="truck" size={20} color={Colors.light.primary} />;
      case "delivered":
        return <Feather name="check-circle" size={20} color={Colors.light.success} />;
      default:
        return <Feather name="clock" size={20} color={Colors.light.gray} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return Colors.light.success;
      case "preparing":
        return Colors.light.primary;
      case "on-the-way":
        return Colors.light.primary;
      case "delivered":
        return Colors.light.success;
      default:
        return Colors.light.gray;
    }
  };

function OrdersContent() {
  const { orders } = useCart();
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          title: "My Orders",
          headerStyle: { backgroundColor: Colors.light.background },
          headerShadowVisible: false,
        }}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{orders.length}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
        </View>

        <View style={styles.ordersContainer}>
          {orders.map((order) => (
            <TouchableOpacity
              key={order.id}
              style={styles.orderCard}
              onPress={() => router.push(`/order/${order.id}`)}
            >
              <View style={styles.orderHeader}>
                <Text style={styles.restaurantName}>{order.restaurantName}</Text>
                
                   <View style={styles.orderStatus}>
                          {getStatusIcon(order.status)}
                          <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                            {order.status.replace("-", " ")}
                          </Text>
                        </View>
              </View>
              <Text style={styles.orderDate}>
                {new Date(order.date).toLocaleString()}
              </Text>
              <Text style={styles.orderItems}>
                {order.items.length} item{order.items.length > 1 ? "s" : ""}
              </Text>
              <Text style={styles.orderTotal}>
                Total: ${order.total.toFixed(2)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </>
  );
}

export default function OrdersScreen() {
  return (
    <AuthGuard>
      <CartProvider>
        <OrdersContent />
      </CartProvider>
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  contentContainer: { padding: 16 },
  orderStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 6,
    textTransform: "capitalize",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.light.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.light.gray,
  },

  ordersContainer: {
    gap: 16,
  },
  orderCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },

  orderDate: {
    fontSize: 12,
    color: Colors.light.gray,
    marginBottom: 4,
  },
  orderItems: {
    fontSize: 14,
    color: Colors.light.text,
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.light.primary,
    marginTop: 4,
  },
});
