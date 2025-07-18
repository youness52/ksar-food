import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

import { Category } from "@/types/restaurant";
import Colors from "@/constants/colors";

interface CategoryCardProps {
  category: Category;
  onPress: (category: Category) => void;
}

export default function CategoryCard({ category, onPress }: CategoryCardProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(category)}
      testID={`category-${category.id}`}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: category.image }} style={styles.image} />
      </View>
      <Text style={styles.name}>{category.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginRight: 16,
    width: 80,
  },
  imageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: "hidden",
    backgroundColor: Colors.light.lightGray,
    marginBottom: 8,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  name: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
});