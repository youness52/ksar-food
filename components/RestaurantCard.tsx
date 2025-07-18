import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";

import { Restaurant } from "@/types/restaurant";
import Colors from "@/constants/colors";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: (restaurant: Restaurant) => void;
}

export default function RestaurantCard({ restaurant, onPress }: RestaurantCardProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(restaurant)}
      testID={`restaurant-${restaurant.id}`}
    >
      <Image source={{ uri: restaurant.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{restaurant.name}</Text>
        <View style={styles.detailsRow}>
          <View style={styles.ratingContainer}>
            <Feather name="star" size={14} color={Colors.light.accent} />
            <Text style={styles.rating}>{restaurant.rating}</Text>
          </View>
          <View style={styles.timeContainer}>
            <Feather name="clock" size={14} color={Colors.light.gray} />
            <Text style={styles.time}>{restaurant.deliveryTime}</Text>
          </View>
        </View>
        <View style={styles.categoriesContainer}>
          {restaurant.categories.map((category, index) => (
            <React.Fragment key={index}>
              <Text style={styles.category}>{category}</Text>
              {index < restaurant.categories.length - 1 && (
                <Text style={styles.dot}>•</Text>
              )}
            </React.Fragment>
          ))}
        </View>
        <Text style={styles.deliveryFee}>
          Delivery: ${restaurant.deliveryFee.toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 150,
  },
  infoContainer: {
    padding: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "500",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  time: {
    marginLeft: 4,
    fontSize: 14,
    color: Colors.light.gray,
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 6,
  },
  category: {
    fontSize: 14,
    color: Colors.light.gray,
  },
  dot: {
    marginHorizontal: 4,
    color: Colors.light.gray,
  },
  deliveryFee: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: "500",
  },
});
