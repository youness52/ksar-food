import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { Linking } from "react-native"; // make sure this is at the top

import React, { useState } from "react";
import { Stack, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

import AdminGuard from "@/components/AdminGuard";
import Colors from "@/constants/colors";
import { useAdminOrders } from "@/hooks/admin-store";
import { Order } from "@/types/restaurant";
import { supabase } from "@/lib/supabase";

function OrdersContent() {
  const router = useRouter();
  const { orders, isLoading, updateOrderStatus } = useAdminOrders();
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [userInfo, setUserInfo] = useState<{ name: string; email: string;phone: string;address: string} | null>(null);

//console.log(orders)
  const filteredOrders = statusFilter
    ? orders.filter((order) => order.status === statusFilter)
    : orders;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Feather name="check-circle" size={20} color={Colors.light.success} />;
      case "preparing":
        return <Feather name="coffee" size={20} color={Colors.light.primary} />;
      case "on-the-way":
        return <Feather name="truck" size={20} color={Colors.light.primary} />;
      case "delivered":
        return <Feather name="check-circle" size={20} color={Colors.light.success} />;
      default:
        return <Feather name="clock" size={20} color={Colors.light.gray} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return Colors.light.success;
      case "preparing":
        return Colors.light.primary;
      case "on-the-way":
        return Colors.light.primary;
      case "delivered":
        return Colors.light.success;
      default:
        return Colors.light.gray;
    }
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateOrderStatus(orderId, newStatus as any);
  };

 const showOrderModal = async (orderId: string) => {
  const order = orders.find((o) => o.id === orderId) || null;
  setSelectedOrder(order);
  setModalVisible(true);

  if (order?.userId) {
    await fetchUserById(order.userId);
  }
};


  const closeModal = () => {
    setModalVisible(false);
    setSelectedOrder(null);
  };

  // Fetch user info from Supabase by userId
  const fetchUserById = async (userId: string) => {
    const { data, error } = await supabase
      .from("users")       // Your user table name
      .select("name, email,phone,address") // Adjust column names accordingly
      .eq("id", userId)
      .single();

   
  if (error) {
    console.error("Failed to fetch user info:", error);
    setUserInfo(null);
  } else {
    setUserInfo(data);
  }
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => showOrderModal(item.id)}
      testID={`order-${item.id}`}
    >
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>#{item.id.split("-")[1]}</Text>
          <Text style={styles.restaurantName}>{item.restaurantName}</Text>
        </View>
        <View style={styles.orderStatus}>
          {getStatusIcon(item.status)}
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.replace("-", " ")}
          </Text>
        </View>
      </View>
      <View style={styles.orderDetails}>
        <Text style={styles.orderTotal}>${item.total.toFixed(2)}</Text>
        <Text style={styles.orderTime}>
          {item.date.toLocaleDateString()} {item.date.toLocaleTimeString()}
        </Text>
      </View>
      <View style={styles.orderActions}>
        {item.status !== "delivered" && (
          <View style={styles.statusButtons}>
            {item.status === "confirmed" && (
              <TouchableOpacity
                style={[styles.statusButton, { backgroundColor: Colors.light.primary }]}
                onPress={() => handleStatusChange(item.id, "preparing")}
              >
                <Text style={styles.statusButtonText}>Start Preparing</Text>
              </TouchableOpacity>
            )}
            {item.status === "preparing" && (
              <TouchableOpacity
                style={[styles.statusButton, { backgroundColor: Colors.light.primary }]}
                onPress={() => handleStatusChange(item.id, "on-the-way")}
              >
                <Text style={styles.statusButtonText}>Out for Delivery</Text>
              </TouchableOpacity>
            )}
            {item.status === "on-the-way" && (
              <TouchableOpacity
                style={[styles.statusButton, { backgroundColor: Colors.light.success }]}
                onPress={() => handleStatusChange(item.id, "delivered")}
              >
                <Text style={styles.statusButtonText}>Mark Delivered</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Orders",
          headerStyle: {
            backgroundColor: Colors.light.background,
          },
          headerShadowVisible: false,
          headerRight: () => (
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => {}}
              testID="filter-orders-button"
            >
              <Feather name="filter" size={20} color={Colors.light.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container} testID="admin-orders">
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterChip, statusFilter === null && styles.activeFilterChip]}
            onPress={() => setStatusFilter(null)}
          >
            <Text
              style={[styles.filterChipText, statusFilter === null && styles.activeFilterChipText]}
            >
              All
            </Text>
          </TouchableOpacity>
          {["confirmed", "preparing", "on-the-way", "delivered"].map((status) => (
            <TouchableOpacity
              key={status}
              style={[styles.filterChip, statusFilter === status && styles.activeFilterChip]}
              onPress={() => setStatusFilter(status)}
            >
              <Text
                style={[styles.filterChipText, statusFilter === status && styles.activeFilterChipText]}
              >
                {status.replace("-", " ")}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrder}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No orders found</Text>
            </View>
          }
        />
      </View>

      {/* Order Info Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Close icon top right */}
            <TouchableOpacity
              style={styles.modalCloseIcon}
              onPress={closeModal}
              testID="modal-close-button"
            >
              <Feather name="x" size={24} color={Colors.light.gray} />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>
              Order #{selectedOrder?.id.split("-")[1]}
            </Text>
            <Text style={styles.modalSubtitle}>{selectedOrder?.restaurantName}</Text>

            {/* User info */}
            {userInfo && (
              <View style={styles.userInfoContainer}>
                <Text style={styles.userInfoTitle}>Customer Info</Text>
                <Text style={styles.userInfoText}>Name: {userInfo.name}</Text>
                {userInfo.phone && (
  <TouchableOpacity onPress={() => Linking.openURL(`tel:${userInfo.phone}`)}>
    <Text style={[styles.userInfoText, ]}>
      Phone: {userInfo.phone}
    </Text>
  </TouchableOpacity>
)}
                {userInfo.address && (
  <TouchableOpacity
    onPress={() =>
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(userInfo.address)}`)
    }
  >
    <Text style={[styles.userInfoText]}>
      Address: {userInfo.address}
    </Text>
  </TouchableOpacity>
)}
              </View>
            )}

            <Text style={styles.modalStatus}>
              Status:{" "}
              <Text style={{ color: getStatusColor(selectedOrder?.status || "") }}>
                {selectedOrder?.status.replace("-", " ")}
              </Text>
            </Text>
            <Text style={styles.modalDate}>
              Ordered at:{" "}
              {selectedOrder?.date.toLocaleDateString()}{" "}
              {selectedOrder?.date.toLocaleTimeString()}
            </Text>

            <ScrollView style={styles.modalItemsContainer}>
              {selectedOrder?.items.map(({ menuItem, quantity }, idx) => (
                <View key={idx} style={styles.modalItem}>
                  <Text style={styles.modalItemName}>{menuItem.name}</Text>
                  <Text style={styles.modalItemQuantity}>x{quantity}</Text>
                  <Text style={styles.modalItemPrice}>
                    ${(menuItem.price * quantity).toFixed(2)}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <Text style={styles.modalTotal}>Total: ${selectedOrder?.total.toFixed(2)}</Text>

            {/* Status update buttons inside modal */}
            {selectedOrder && selectedOrder.status !== "delivered" && (
              <View style={styles.statusButtons}>
                {selectedOrder.status === "confirmed" && (
                  <TouchableOpacity
                    style={[styles.statusButton, { backgroundColor: Colors.light.primary }]}
                    onPress={() => {
                      handleStatusChange(selectedOrder.id, "preparing");
                      closeModal();
                    }}
                  >
                    <Text style={styles.statusButtonText}>Start Preparing</Text>
                  </TouchableOpacity>
                )}
                {selectedOrder.status === "preparing" && (
                  <TouchableOpacity
                    style={[styles.statusButton, { backgroundColor: Colors.light.primary }]}
                    onPress={() => {
                      handleStatusChange(selectedOrder.id, "on-the-way");
                      closeModal();
                    }}
                  >
                    <Text style={styles.statusButtonText}>Out for Delivery</Text>
                  </TouchableOpacity>
                )}
                {selectedOrder.status === "on-the-way" && (
                  <TouchableOpacity
                    style={[styles.statusButton, { backgroundColor: Colors.light.success }]}
                    onPress={() => {
                      handleStatusChange(selectedOrder.id, "delivered");
                      closeModal();
                    }}
                  >
                    <Text style={styles.statusButtonText}>Mark Delivered</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.light.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.light.lightGray,
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: Colors.light.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.light.gray,
    textTransform: "capitalize",
  },
  activeFilterChipText: {
    color: "#fff",
  },
  filterButton: {
    padding: 8,
    marginRight: 8,
  },
  listContainer: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 14,
    color: Colors.light.gray,
  },
  orderStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 6,
    textTransform: "capitalize",
  },
  orderDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.primary,
  },
  orderTime: {
    fontSize: 12,
    color: Colors.light.gray,
  },
  orderActions: {
    marginTop: 8,
  },
  statusButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  statusButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContainer: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 24,
    width: "100%",
    maxHeight: "80%",
  },
  modalCloseIcon: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: Colors.light.gray,
  },
  userInfoContainer: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: Colors.light.lightGray,
    borderRadius: 8,
  },
  userInfoTitle: {
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 4,
  },
  userInfoText: {
    fontSize: 13,
    color: Colors.light.gray,
  },
  modalStatus: {
    fontSize: 14,
    marginBottom: 8,
  },
  modalDate: {
    fontSize: 12,
    color: Colors.light.gray,
    marginBottom: 12,
  },
  modalItemsContainer: {
    maxHeight: 200,
    marginBottom: 12,
  },
  modalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  modalItemName: {
    fontWeight: "600",
    fontSize: 14,
  },
  modalItemQuantity: {
    fontSize: 14,
    color: Colors.light.gray,
  },
  modalItemPrice: {
    fontWeight: "600",
    fontSize: 14,
  },
  modalTotal: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "right",
    color: Colors.light.primary,
  },
});

export default function AdminOrders() {
  return (
    <AdminGuard>
      <OrdersContent />
    </AdminGuard>
  );
}
