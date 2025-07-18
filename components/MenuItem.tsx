import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";

import { MenuItem as MenuItemType } from "@/types/restaurant";
import Colors from "@/constants/colors";

interface MenuItemProps {
  item: MenuItemType;
  onPress: (item: MenuItemType) => void;
}

export default function MenuItem({ item, onPress }: MenuItemProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(item)}
      testID={`menu-item-${item.id}`}
    >
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => onPress(item)}
          testID={`add-item-${item.id}`}
        >
          <Feather name="plus" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoContainer: {
    flex: 1,
    marginRight: 12,
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.light.gray,
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.primary,
  },
  imageContainer: {
    position: "relative",
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  addButton: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: Colors.light.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
