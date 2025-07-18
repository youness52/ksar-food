import { FlatList, ScrollView, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Stack } from "expo-router";

import CategoryCard from "@/components/CategoryCard";
import RestaurantCard from "@/components/RestaurantCard";
import AuthGuard from "@/components/AuthGuard";
import { Category, Restaurant } from "@/types/restaurant";
import Colors from "@/constants/colors";
import { CartProvider } from "@/hooks/cart-store";
import { RestaurantsProvider, useRestaurants } from "@/hooks/restaurants-store";

function HomeContent() {
  const router = useRouter();
  const { restaurants, categories, isLoading } = useRestaurants();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredRestaurants = selectedCategory
    ? restaurants.filter((restaurant) =>
        restaurant.categories.some(
          (category) => category.toLowerCase() === selectedCategory.toLowerCase()
        )
      )
    : restaurants;

  const handleCategoryPress = (category: Category) => {
    setSelectedCategory(
      selectedCategory === category.name ? null : category.name
    );
  };

  const handleRestaurantPress = (restaurant: Restaurant) => {
    router.push(`/restaurant/${restaurant.id}`);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <Text style={styles.loadingText}>Loading restaurants...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Food Delivery",
          headerStyle: {
            backgroundColor: Colors.light.background,
          },
          headerShadowVisible: false,
        }}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        testID="home-screen"
      >
        <Text style={styles.greeting}>What would you like to eat?</Text>

        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          >
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onPress={handleCategoryPress}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.restaurantsContainer}>
          <Text style={styles.sectionTitle}>
            {selectedCategory
              ? `${selectedCategory} Restaurants`
              : "Popular Restaurants"}
          </Text>
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onPress={handleRestaurantPress}
            />
          ))}
        </View>
      </ScrollView>
    </>
  );
}

export default function HomeScreen() {
  return (
    <AuthGuard>
      <CartProvider>
        <RestaurantsProvider>
          <HomeContent />
        </RestaurantsProvider>
      </CartProvider>
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  contentContainer: {
    padding: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  categoriesList: {
    paddingRight: 16,
  },
  restaurantsContainer: {
    marginBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.light.gray,
  },
});