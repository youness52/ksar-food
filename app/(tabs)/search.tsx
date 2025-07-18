import { FlatList, StyleSheet, Text, TextInput, View, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Stack } from "expo-router";
import { Feather } from "@expo/vector-icons";  // Updated import

import RestaurantCard from "@/components/RestaurantCard";
import AuthGuard from "@/components/AuthGuard";
import { Restaurant } from "@/types/restaurant";
import Colors from "@/constants/colors";
import { CartProvider } from "@/hooks/cart-store";
import { RestaurantsProvider, useRestaurants } from "@/hooks/restaurants-store";

function SearchContent() {
  const router = useRouter();
  const { restaurants, isLoading } = useRestaurants();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRestaurants(restaurants);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = restaurants.filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(query) ||
        restaurant.categories.some((category) =>
          category.toLowerCase().includes(query)
        ) ||
        restaurant.menu.some(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)
        )
    );

    setFilteredRestaurants(filtered);
  }, [searchQuery, restaurants]);

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
          title: "Search",
          headerStyle: {
            backgroundColor: Colors.light.background,
          },
          headerShadowVisible: false,
        }}
      />
      <View style={styles.container} testID="search-screen">
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color={Colors.light.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for restaurants, cuisines, dishes..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
            testID="search-input"
          />
        </View>

        {filteredRestaurants.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No results found</Text>
            <Text style={styles.emptySubtext}>
              Try searching for a different restaurant or cuisine
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredRestaurants}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <RestaurantCard
                restaurant={item}
                onPress={handleRestaurantPress}
              />
            )}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </>
  );
}

export default function SearchScreen() {
  return (
    <AuthGuard>
      <CartProvider>
        <RestaurantsProvider>
          <SearchContent />
        </RestaurantsProvider>
      </CartProvider>
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 48,
    marginLeft: 8,
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 16,
    color: Colors.light.gray,
    textAlign: "center",
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
