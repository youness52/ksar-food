import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { Feather } from "@expo/vector-icons";

import AdminGuard from "@/components/AdminGuard";
import Colors from "@/constants/colors";
import { useAdminStats } from "@/hooks/admin-store";

function DashboardContent() {
  const { stats, isLoading } = useAdminStats();

  const statsCards = [
    {
      title: "Total Revenue",
      value: `$${stats?.totalRevenue?.toFixed(2) || '0.00'}`,
      icon: <Feather name="dollar-sign" size={24} color={Colors.light.primary} />,
      change: "+12.5%",
      changeType: "positive" as const,
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders?.toString() || '0',
      icon: <Feather name="shopping-bag" size={24} color={Colors.light.primary} />,
      change: "+8.2%",
      changeType: "positive" as const,
    },
    {
      title: "Active Users",
      value: stats?.totalUsers?.toString() || '0',
      icon: <Feather name="users" size={24} color={Colors.light.primary} />,
      change: "+15.3%",
      changeType: "positive" as const,
    },
    {
      title: "Restaurants",
      value: stats?.totalRestaurants?.toString() || '0',
      icon: <Feather name="grid" size={24} color={Colors.light.primary} />,
      change: "+2.1%",
      changeType: "positive" as const,
    },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: "Admin Dashboard",
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
        testID="admin-dashboard"
      >
        <Text style={styles.welcomeText}>Welcome to Admin Dashboard</Text>
        <Text style={styles.subtitleText}>Manage your food delivery platform</Text>

        <View style={styles.statsGrid}>
          {statsCards.map((card, index) => (
            <TouchableOpacity key={index} style={styles.statCard}>
              <View style={styles.statHeader}>
                <View style={styles.statIconContainer}>
                  {card.icon}
                </View>
                <View style={[
                  styles.changeContainer,
                  { backgroundColor: card.changeType === 'positive' ? Colors.light.success + '20' : Colors.light.error + '20' }
                ]}>
                  <Feather
                    name="trending-up"
                    size={12}
                    color={card.changeType === 'positive' ? Colors.light.success : Colors.light.error}
                  />
                  <Text style={[
                    styles.changeText,
                    { color: card.changeType === 'positive' ? Colors.light.success : Colors.light.error }
                  ]}>
                    {card.change}
                  </Text>
                </View>
              </View>
              <Text style={styles.statValue}>{card.value}</Text>
              <Text style={styles.statTitle}>{card.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <Feather name="grid" size={32} color={Colors.light.primary} />
              <Text style={styles.actionTitle}>Add Restaurant</Text>
              <Text style={styles.actionSubtitle}>Create new restaurant</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Feather name="users" size={32} color={Colors.light.primary} />
              <Text style={styles.actionTitle}>Manage Users</Text>
              <Text style={styles.actionSubtitle}>View all users</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Feather name="shopping-bag" size={32} color={Colors.light.primary} />
              <Text style={styles.actionTitle}>View Orders</Text>
              <Text style={styles.actionSubtitle}>Track all orders</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.recentActivity}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <View style={styles.activityDot} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>New order from Pizza Paradise</Text>
                <Text style={styles.activityTime}>2 minutes ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityDot} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>New user registered</Text>
                <Text style={styles.activityTime}>5 minutes ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityDot} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Restaurant updated menu</Text>
                <Text style={styles.activityTime}>10 minutes ago</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

export default function AdminDashboard() {
  return (
    <AdminGuard>
      <DashboardContent />
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
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
    color: Colors.light.gray,
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    width: "48%",
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
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  changeContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  changeText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: Colors.light.gray,
  },
  quickActions: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionCard: {
    width: "30%",
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 4,
    textAlign: "center",
  },
  actionSubtitle: {
    fontSize: 12,
    color: Colors.light.gray,
    textAlign: "center",
  },
  recentActivity: {
    marginBottom: 24,
  },
  activityList: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.primary,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: Colors.light.gray,
  },
});
