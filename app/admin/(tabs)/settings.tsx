import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import React from "react";
import { Stack, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

import AdminGuard from "@/components/AdminGuard";
import Colors from "@/constants/colors";
import { useAuth } from "@/hooks/auth-store";

function SettingsContent() {
  const router = useRouter();
  const { user, signOut, isSigningOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
              router.replace("/auth/login");
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to sign out");
            }
          },
        },
      ]
    );
  };

  const settingsOptions = [
    {
      id: "categories",
      title: "Manage Categories",
      subtitle: "Add, edit, or remove food categories",
      icon: <Feather name="grid" size={20} color={Colors.light.gray} />,
      onPress: () => {},
    },
    {
      id: "notifications",
      title: "Notification Settings",
      subtitle: "Configure app notifications",
      icon: <Feather name="bell" size={20} color={Colors.light.gray} />,
      onPress: () => {},
    },
    {
      id: "permissions",
      title: "Admin Permissions",
      subtitle: "Manage admin roles and permissions",
      icon: <Feather name="shield" size={20} color={Colors.light.gray} />,
      onPress: () => {},
    },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: "Admin Settings",
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
        testID="admin-settings"
      >
        <View style={styles.profileSection}>
          <View style={styles.profileInfo}>
            <View style={styles.profileAvatar}>
              <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.profileDetails}>
              <Text style={styles.profileName}>{user?.name}</Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
              <View style={styles.adminBadge}>
                <Feather name="shield" size={12} color="#fff" />
                <Text style={styles.adminBadgeText}>Administrator</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.quickStats}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Feather name="grid" size={24} color={Colors.light.primary} />
              <Text style={styles.statValue}>4</Text>
              <Text style={styles.statLabel}>Restaurants</Text>
            </View>
            <View style={styles.statCard}>
              <Feather name="users" size={24} color={Colors.light.primary} />
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Users</Text>
            </View>
            <View style={styles.statCard}>
              <Feather name="shopping-bag" size={24} color={Colors.light.primary} />
              <Text style={styles.statValue}>45</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.settingsContainer}>
            {settingsOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.settingItem}
                onPress={option.onPress}
                testID={`setting-${option.id}`}
              >
                <View style={styles.settingLeft}>
                  {option.icon}
                  <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>{option.title}</Text>
                    <Text style={styles.settingSubtitle}>{option.subtitle}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.signOutButton, isSigningOut && styles.disabledButton]}
          onPress={handleSignOut}
          disabled={isSigningOut}
          testID="admin-sign-out-button"
        >
          <Feather name="log-out" size={20} color="#fff" style={styles.signOutIcon} />
          <Text style={styles.signOutButtonText}>
            {isSigningOut ? "Signing Out..." : "Sign Out"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

export default function AdminSettings() {
  return (
    <AdminGuard>
      <SettingsContent />
    </AdminGuard>
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
  profileSection: {
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
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.light.gray,
    marginBottom: 8,
  },
  adminBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  adminBadgeText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
    marginLeft: 4,
  },
  quickStats: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    width: "30%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.light.gray,
    textAlign: "center",
  },
  settingsSection: {
    marginBottom: 24,
  },
  settingsContainer: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: Colors.light.gray,
  },
  signOutButton: {
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
  signOutIcon: {
    marginRight: 8,
  },
  signOutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
