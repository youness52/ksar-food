import { FlatList, StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { Stack, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

import AdminGuard from "@/components/AdminGuard";
import Colors from "@/constants/colors";
import { useAdminRestaurants } from "@/hooks/admin-store";
import { Restaurant } from "@/types/restaurant";

function RestaurantsContent() {
  const router = useRouter();
  const { restaurants, isLoading, deleteRestaurant } = useAdminRestaurants();

  const handleDeleteRestaurant = (restaurant: Restaurant) => {
    Alert.alert(
      "Delete Restaurant",
      `Are you sure you want to delete "${restaurant.name}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteRestaurant(restaurant.id),
        },
      ]
    );
  };

  const renderRestaurant = ({ item }: { item: Restaurant }) => (
    <View style={styles.restaurantCard}>
      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{item.name}</Text>
        <View style={styles.restaurantDetails}>
          <View style={styles.detailItem}>
            <Feather name="star" size={14} color={Colors.light.accent} />
            <Text style={styles.detailText}>{item.rating}</Text>
          </View>
          <View style={styles.detailItem}>
            <Feather name="clock" size={14} color={Colors.light.gray} />
            <Text style={styles.detailText}>{item.deliveryTime}</Text>
          </View>
          <Text style={styles.deliveryFee}>${item.deliveryFee.toFixed(2)}</Text>
        </View>
        <View style={styles.categoriesContainer}>
          {item.categories.map((category, index) => (
            <Text key={index} style={styles.categoryTag}>
              {category}
            </Text>
          ))}
        </View>
      </View>
      <View style={styles.restaurantActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push(`/admin/restaurant/${item.id}`)}
          testID={`edit-restaurant-${item.id}`}
        >
          <Feather name="edit" size={18} color={Colors.light.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteRestaurant(item)}
          testID={`delete-restaurant-${item.id}`}
        >
          <Feather name="trash-2" size={18} color={Colors.light.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

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
          title: "Restaurants",
          headerStyle: {
            backgroundColor: Colors.light.background,
          },
          headerShadowVisible: false,
          headerRight: () => (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/admin/restaurant/new")}
              testID="add-restaurant-button"
            >
              <Feather name="plus" size={20} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container} testID="admin-restaurants">
        <FlatList
          data={restaurants}
          keyExtractor={(item) => item.id}
          renderItem={renderRestaurant}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No restaurants found</Text>
              <TouchableOpacity
                style={styles.addRestaurantButton}
                onPress={() => router.push("/admin/restaurant/new")}
              >
                <Text style={styles.addRestaurantButtonText}>Add First Restaurant</Text>
              </TouchableOpacity>
            </View>
          }
        />
      </View>
    </>
  );
}

export default function AdminRestaurants() {
  return (
    <AdminGuard>
      <RestaurantsContent />
    </AdminGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  listContainer: {
    padding: 16,
  },
  addButton: {
    backgroundColor: Colors.light.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  restaurantCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  restaurantDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  detailText: {
    fontSize: 14,
    marginLeft: 4,
    color: Colors.light.gray,
  },
  deliveryFee: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: "500",
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  categoryTag: {
    fontSize: 12,
    color: Colors.light.gray,
    backgroundColor: Colors.light.lightGray,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 4,
  },
  restaurantActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.gray,
    marginBottom: 16,
  },
  addRestaurantButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addRestaurantButtonText: {
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
});
