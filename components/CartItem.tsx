import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";

import { CartItem as CartItemType } from "@/types/restaurant";
import Colors from "@/constants/colors";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <View style={styles.container} testID={`cart-item-${item.menuItem.id}`}>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.menuItem.name}</Text>
        <Text style={styles.restaurant}>{item.restaurantName}</Text>
        <Text style={styles.price}>
          ${(item.menuItem.price * item.quantity).toFixed(2)}
        </Text>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onRemove(item.menuItem.id)}
          testID={`remove-item-${item.menuItem.id}`}
        >
          <Feather name="trash-2" size={18} color={Colors.light.error} />
        </TouchableOpacity>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => onUpdateQuantity(item.menuItem.id, item.quantity - 1)}
            testID={`decrease-item-${item.menuItem.id}`}
          >
            <Feather name="minus" size={16} color={Colors.light.gray} />
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => onUpdateQuantity(item.menuItem.id, item.quantity + 1)}
            testID={`increase-item-${item.menuItem.id}`}
          >
            <Feather name="plus" size={16} color={Colors.light.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  restaurant: {
    fontSize: 14,
    color: Colors.light.gray,
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.primary,
  },
  actionsContainer: {
    alignItems: "flex-end",
  },
  actionButton: {
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.lightGray,
    borderRadius: 20,
    padding: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  quantity: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 8,
  },
});
