import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { Stack, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

import AdminGuard from "@/components/AdminGuard";
import Colors from "@/constants/colors";
import { useAdminRestaurants } from "@/hooks/admin-store";
import { Restaurant } from "@/types/restaurant";
import { supabase } from "@/lib/supabase"; // Make sure supabase is correctly imported

function RestaurantsContent() {
  const router = useRouter();
  const { restaurants, isLoading, deleteRestaurant } = useAdminRestaurants();

  const [modalVisible, setModalVisible] = useState(false);

  const [name, setName] = useState("");
  const [rating, setRating] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [deliveryFee, setDeliveryFee] = useState("");
  const [categories, setCategories] = useState("");

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

  const handleAddRestaurant = async () => {
    if (!name || !rating || !deliveryTime || !deliveryFee) {
      Alert.alert("Please fill all required fields");
      return;
    }

    const { error } = await supabase.from("restaurants").insert({
      name,
      rating: parseFloat(rating),
      delivery_time: deliveryTime,
      delivery_fee: parseFloat(deliveryFee),
      categories: categories.split(",").map((c) => c.trim()),
      image:"https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=600&auto=format&fit=crop",
    });

    if (error) {
      console.error("Insert error:", error.message);
      Alert.alert("Error adding restaurant");
    } else {
      Alert.alert("Restaurant added!");
      setModalVisible(false);
      setName("");
      setRating("");
      setDeliveryTime("");
      setDeliveryFee("");
      setCategories("");
      router.push("/admin/(tabs)/restaurants");
    }
  };

  const renderRestaurant = ({ item }: { item: Restaurant }) => (
    <TouchableOpacity onPress={() => {}} activeOpacity={0.8}>
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
          >
            <Feather name="edit" size={18} color={Colors.light.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteRestaurant(item)}
          >
            <Feather name="trash-2" size={18} color={Colors.light.error} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
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
              onPress={() => setModalVisible(true)}
            >
              <Feather name="plus" size={20} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />

      {/* Add Restaurant Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Restaurant</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Rating"
              keyboardType="numeric"
              value={rating}
              onChangeText={setRating}
            />
            <TextInput
              style={styles.input}
              placeholder="Delivery Time"
              value={deliveryTime}
              onChangeText={setDeliveryTime}
            />
            <TextInput
              style={styles.input}
              placeholder="Delivery Fee"
              keyboardType="numeric"
              value={deliveryFee}
              onChangeText={setDeliveryFee}
            />
            <TextInput
              style={styles.input}
              placeholder="Categories (comma separated)"
              value={categories}
              onChangeText={setCategories}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddRestaurant}
              >
                <Text style={styles.addText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.container}>
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
                onPress={() => setModalVisible(true)}
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
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight:16
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    width: "90%",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
  },
  cancelText: {
    color: "#000",
    fontWeight: "600",
  },
  addText: {
    color: "#fff",
    fontWeight: "600",
  },
});
