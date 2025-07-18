import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";

import { useAuth } from "@/hooks/auth-store";
import Colors from "@/constants/colors";

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { user, isLoading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/auth/login");
      return;
    }

    if (!isAdmin) {
      router.replace("/(tabs)");
      return;
    }
  }, [user, isLoading, isAdmin, router]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  if (!user || !isAdmin) {
    return (
      <View style={styles.accessDeniedContainer}>
        <Text style={styles.accessDeniedText}>Access Denied</Text>
        <Text style={styles.accessDeniedSubtext}>You don't have admin privileges</Text>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.background,
  },
  accessDeniedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.background,
    padding: 32,
  },
  accessDeniedText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    color: Colors.light.error,
  },
  accessDeniedSubtext: {
    fontSize: 16,
    color: Colors.light.gray,
    textAlign: "center",
  },
});