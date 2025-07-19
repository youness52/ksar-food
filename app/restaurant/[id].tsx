import {
  FlatList,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import MenuItem from "@/components/MenuItem";
import AuthGuard from "@/components/AuthGuard";
import { MenuItem as MenuItemType } from "@/types/restaurant";
import Colors from "@/constants/colors";
import { CartProvider, useCart } from "@/hooks/cart-store";
import { RestaurantsProvider, useRestaurants } from "@/hooks/restaurants-store";

function RestaurantContent() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addToCart, cart } = useCart();
  const { restaurants, isLoading } = useRestaurants();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const restaurant = restaurants.find((r) => r.id === id);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
//console.log(cart)
  const handleAddToCart = (item: MenuItemType) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (restaurant) {
      addToCart({
        menuItem: item,
        quantity: 1,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
      });
      
    }
    
  };

  const handleGoToCart = () => {
    router.push("/cart");
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <Text style={styles.loadingText}>Loading restaurant...</Text>
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Restaurant not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          testID="back-button"
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const categories = Array.from(
    new Set(restaurant.menu.map((item) => item.category))
  );

  const filteredMenu = selectedCategory
    ? restaurant.menu.filter((item) => item.category === selectedCategory)
    : restaurant.menu;

  return (
    <>
      <Stack.Screen
        options={{
          title: restaurant.name,
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
      <View style={styles.container} testID="restaurant-screen">
        <Image source={{ uri: restaurant.image }} style={styles.coverImage} />

        <View style={styles.infoContainer}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <View style={styles.detailsRow}>
            <View style={styles.ratingContainer}>
              <Feather name="star" size={16} color={Colors.light.accent} />
              <Text style={styles.rating}>{restaurant.rating}</Text>
            </View>
            <View style={styles.timeContainer}>
              <Feather name="clock" size={16} color={Colors.light.gray} />
              <Text style={styles.time}>{restaurant.deliveryTime}</Text>
            </View>
            <Text style={styles.deliveryFee}>
              Delivery:  {restaurant.deliveryFee.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.categoriesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          >
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === null && styles.selectedCategoryButton,
              ]}
              onPress={() => setSelectedCategory(null)}
              testID="category-all"
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === null && styles.selectedCategoryButtonText,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.selectedCategoryButton,
                ]}
                onPress={() => setSelectedCategory(category)}
                testID={`category- {category}`}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category && styles.selectedCategoryButtonText,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <FlatList
          data={filteredMenu}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MenuItem item={item} onPress={handleAddToCart} />
          )}
          contentContainerStyle={styles.menuList}
          showsVerticalScrollIndicator={false}
        />

        {totalItems > 0 && (
          <TouchableOpacity
            style={styles.floatingCartButton}
            onPress={handleGoToCart}
          >
            <Feather name="shopping-bag" size={24} color="#fff" />
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{totalItems}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}

export default function RestaurantScreen() {
  return (
    <AuthGuard>
      <CartProvider>
        <RestaurantsProvider>
          <RestaurantContent />
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
  headerBackButton: {
    marginLeft: 8,
  },
  coverImage: {
    width: "100%",
    height: 200,
  },
  infoContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "500",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  time: {
    marginLeft: 4,
    fontSize: 14,
    color: Colors.light.gray,
  },
  deliveryFee: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: "500",
  },
  categoriesContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  categoriesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.light.lightGray,
    marginRight: 8,
  },
  selectedCategoryButton: {
    backgroundColor: Colors.light.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.light.gray,
  },
  selectedCategoryButtonText: {
    color: "#fff",
  },
  menuList: {
    padding: 16,
    paddingBottom: 80,
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
  floatingCartButton: {
    position: "absolute",
    bottom: 24,
    left: 24,
    backgroundColor: Colors.light.primary,
    padding: 16,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cartBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
