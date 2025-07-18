import { FlatList, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Alert } from "react-native";
import React from "react";
import { Stack, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

import AdminGuard from "@/components/AdminGuard";
import Colors from "@/constants/colors";
import { useAdminUsers } from "@/hooks/admin-store";
import { User as UserType } from "@/hooks/auth-store";

function UsersContent() {
  const router = useRouter();
  const { users, isLoading, updateUserRole } = useAdminUsers();

  const handleRoleChange = (user: UserType) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    Alert.alert(
      "Change User Role",
      `Are you sure you want to make ${user.name} ${newRole === 'admin' ? 'an admin' : 'a regular user'}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => updateUserRole(user.id, newRole),
        },
      ]
    );
  };

  const renderUser = ({ item }: { item: UserType }) => (
    <TouchableOpacity
      style={styles.userCard}
      onPress={() => router.push(`/admin/user/${item.id}`)}
      testID={`user-${item.id}`}
    >
      <View style={styles.userInfo}>
        <View style={styles.userAvatar}>
          {item.avatar ? (
            <Text style={styles.avatarText}>{item.name?.charAt(0).toUpperCase()}</Text>
          ) : (
            <Feather name="user" size={24} color={Colors.light.gray} />
          )}
        </View>
        <View style={styles.userDetails}>
          <View style={styles.userNameRow}>
            <Text style={styles.userName}>{item.name}</Text>
            {item.role === 'admin' && (
              <View style={styles.adminBadge}>
                <Feather name="shield" size={12} color="#fff" />
                <Text style={styles.adminBadgeText}>Admin</Text>
              </View>
            )}
          </View>
          <View style={styles.userMeta}>
            <Feather name="mail" size={12} color={Colors.light.gray} />
            <Text style={styles.userEmail}>{item.email}</Text>
          </View>
        </View>
      </View>
      <View style={styles.userActions}>
        <TouchableOpacity
          style={styles.roleButton}
          onPress={() => handleRoleChange(item)}
          testID={`toggle-role-${item.id}`}
        >
          <Text
            style={[
              styles.roleButtonText,
              { color: item.role === 'admin' ? Colors.light.error : Colors.light.primary },
            ]}
          >
            {item.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreButton}>
          <Feather name="more-vertical" size={18} color={Colors.light.gray} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <Text style={styles.loadingText}>Loading users...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Users",
          headerStyle: {
            backgroundColor: Colors.light.background,
          },
          headerShadowVisible: false,
        }}
      />
      <View style={styles.container} testID="admin-users">
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{users.length}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{users.filter(u => u.role === 'admin').length}</Text>
            <Text style={styles.statLabel}>Admins</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{users.filter(u => u.role === 'user').length}</Text>
            <Text style={styles.statLabel}>Regular Users</Text>
          </View>
        </View>

        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderUser}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No users found</Text>
            </View>
          }
        />
      </View>
    </>
  );
}

export default function AdminUsers() {
  return (
    <AdminGuard>
      <UsersContent />
    </AdminGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: Colors.light.card,
    margin: 16,
    borderRadius: 12,
    padding: 16,
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
    fontSize: 12,
    color: Colors.light.gray,
    textAlign: "center",
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  userCard: {
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
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.lightGray,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.primary,
  },
  userDetails: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
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
  userMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  userEmail: {
    fontSize: 14,
    color: Colors.light.gray,
    marginLeft: 4,
  },
  userActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  roleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.light.lightGray,
    marginRight: 8,
  },
  roleButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  moreButton: {
    padding: 4,
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
});
