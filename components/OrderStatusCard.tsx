import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";

import { Order } from "@/types/restaurant";
import Colors from "@/constants/colors";

interface OrderStatusCardProps {
  order: Order;
}

export default function OrderStatusCard({ order }: OrderStatusCardProps) {
  const getStatusIcon = () => {
    switch (order.status) {
      case "confirmed":
        return <Feather name="check-circle" size={24} color={Colors.light.success} />;
      case "preparing":
        return <Feather name="coffee" size={24} color={Colors.light.primary} />;
      case "on-the-way":
        return <Feather name="truck" size={24} color={Colors.light.primary} />;
      case "delivered":
        return <Feather name="check-circle" size={24} color={Colors.light.success} />;
      default:
        return <Feather name="clock" size={24} color={Colors.light.gray} />;
    }
  };

  const getStatusText = () => {
    switch (order.status) {
      case "confirmed":
        return "Order Confirmed";
      case "preparing":
        return "Preparing Your Food";
      case "on-the-way":
        return "On The Way";
      case "delivered":
        return "Delivered";
      default:
        return "Pending";
    }
  };

  return (
    <View style={styles.container} testID={`order-status-${order.id}`}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>{getStatusIcon()}</View>
        <View>
          <Text style={styles.statusText}>{getStatusText()}</Text>
          <Text style={styles.estimatedTime}>
            Estimated delivery: {order.estimatedDeliveryTime}
          </Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width:
                  order.status === "confirmed"
                    ? "25%"
                    : order.status === "preparing"
                    ? "50%"
                    : order.status === "on-the-way"
                    ? "75%"
                    : "100%",
              },
            ]}
          />
        </View>
        <View style={styles.stepsContainer}>
          <View style={styles.step}>
            <View
              style={[
                styles.stepDot,
                {
                  backgroundColor:
                    ["confirmed", "preparing", "on-the-way", "delivered"].includes(
                      order.status
                    )
                      ? Colors.light.primary
                      : Colors.light.lightGray,
                },
              ]}
            />
            <Text style={styles.stepText}>Confirmed</Text>
          </View>
          <View style={styles.step}>
            <View
              style={[
                styles.stepDot,
                {
                  backgroundColor: ["preparing", "on-the-way", "delivered"].includes(
                    order.status
                  )
                    ? Colors.light.primary
                    : Colors.light.lightGray,
                },
              ]}
            />
            <Text style={styles.stepText}>Preparing</Text>
          </View>
          <View style={styles.step}>
            <View
              style={[
                styles.stepDot,
                {
                  backgroundColor: ["on-the-way", "delivered"].includes(order.status)
                    ? Colors.light.primary
                    : Colors.light.lightGray,
                },
              ]}
            />
            <Text style={styles.stepText}>On the way</Text>
          </View>
          <View style={styles.step}>
            <View
              style={[
                styles.stepDot,
                {
                  backgroundColor:
                    order.status === "delivered"
                      ? Colors.light.primary
                      : Colors.light.lightGray,
                },
              ]}
            />
            <Text style={styles.stepText}>Delivered</Text>
          </View>
        </View>
      </View>

      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{order.restaurantName}</Text>
        <Text style={styles.itemCount}>
          {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.lightGray,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  statusText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  estimatedTime: {
    fontSize: 14,
    color: Colors.light.gray,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.light.lightGray,
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: 4,
    backgroundColor: Colors.light.primary,
    borderRadius: 2,
  },
  stepsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  step: {
    alignItems: "center",
    width: "25%",
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  stepText: {
    fontSize: 12,
    color: Colors.light.gray,
    textAlign: "center",
  },
  restaurantInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.light.lightGray,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "500",
  },
  itemCount: {
    fontSize: 14,
    color: Colors.light.gray,
  },
});
