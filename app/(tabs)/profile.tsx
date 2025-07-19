import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import React from "react";
import { Stack, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons"; // updated import

import Colors from "@/constants/colors";
import AuthGuard from "@/components/AuthGuard";
import { CartProvider, useCart } from "@/hooks/cart-store";
import { useAuth } from "@/hooks/auth-store";

function ProfileContent() {
  const router = useRouter();
  const { orders } = useCart();
  const { user, signOut, isSigningOut, isAdmin } = useAuth();

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
          } catch (error: any) {
            Alert.alert("Error", error.message || "Failed to sign out");
          }
        },
      },
    ]);
  };

  const profileOptions = [
    {
      id: "address",
      title: "Delivery Addresses",
      icon: <Feather name="map-pin" size={20} color={Colors.light.gray} />,
    },
    {
      id: "payment",
      title: "Payment Methods",
      icon: <Feather name="credit-card" size={20} color={Colors.light.gray} />,
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: <Feather name="bell" size={20} color={Colors.light.gray} />,
    },
    {
      id: "settings",
      title: "Settings",
      icon: <Feather name="settings" size={20} color={Colors.light.gray} />,
    },
    {
      id: "help",
      title: "Help & Support",
      icon: <Feather name="help-circle" size={20} color={Colors.light.gray} />,
    },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: "Profile",
          headerStyle: { backgroundColor: Colors.light.background },
          headerShadowVisible: false,
        }}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        testID="profile-screen"
      >
        <View style={styles.profileHeader}>
          <Image
            source={{
              uri:
                user?.avatar ||
                "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
            }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <View style={styles.profileNameRow}>
              <Text style={styles.profileName}>{user?.name || "User"}</Text>
              {isAdmin && (
                <View style={styles.adminBadge}>
                  <Feather name="shield" size={12} color="#fff" />
                  <Text style={styles.adminBadgeText}>Admin</Text>
                </View>
              )}
            </View>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>
        </View>

        {isAdmin && (
          <TouchableOpacity
            style={styles.adminPanelButton}
            onPress={() => router.push("/admin/(tabs)")}
            testID="admin-panel-button"
          >
            <View style={styles.adminPanelLeft}>
              <Feather name="shield" size={20} color={Colors.light.primary} />
              <Text style={styles.adminPanelText}>Admin Panel</Text>
            </View>
            <Feather name="chevron-right" size={20} color={Colors.light.gray} />
          </TouchableOpacity>
        )}

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{orders.length}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Addresses</Text>
          </View>
        </View>

        <View style={styles.optionsContainer}>
          {profileOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionItem}
              testID={`profile-option-${option.id}`}
            >
              <View style={styles.optionLeft}>
                {option.icon}
                <Text style={styles.optionTitle}>{option.title}</Text>
              </View>
              <Feather
                name="chevron-right"
                size={20}
                color={Colors.light.gray}
              />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, isSigningOut && styles.disabledButton]}
          onPress={handleSignOut}
          disabled={isSigningOut}
          testID="logout-button"
        >
          <Feather name="log-out" size={20} color="#fff" style={styles.logoutIcon} />
          <Text style={styles.logoutButtonText}>
            {isSigningOut ? "Signing Out..." : "Sign Out"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

export default function ProfileScreen() {
  return (
    <AuthGuard>
      <CartProvider>
        <ProfileContent />
      </CartProvider>
    </AuthGuard>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  contentContainer: { padding: 16 },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: { flex: 1 },
  profileNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "600",
    marginRight: 8,
  },
  adminBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  adminBadgeText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "600",
    marginLeft: 2,
  },
  profileEmail: {
    fontSize: 16,
    color: Colors.light.gray,
  },
  adminPanelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.light.primary + "10",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.light.primary + "20",
  },
  adminPanelLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  adminPanelText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.primary,
    marginLeft: 12,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.light.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.light.gray,
  },
  statDivider: {
    width: 1,
    height: "100%",
    backgroundColor: Colors.light.border,
  },
  optionsContainer: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionTitle: {
    fontSize: 16,
    marginLeft: 12,
  },
  logoutButton: {
    backgroundColor: Colors.light.error,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
