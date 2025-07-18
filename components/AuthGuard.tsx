import { View, ActivityIndicator, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";

import { useAuth } from "@/hooks/auth-store";
import Colors from "@/constants/colors";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "auth";

    if (!user && !inAuthGroup) {
      // User is not authenticated and not in auth screens, redirect to login
      router.replace("/auth/login");
    } else if (user && inAuthGroup) {
      // User is authenticated but in auth screens, redirect to main app
      router.replace("/(tabs)");
    }
  }, [user, isLoading, segments, router]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
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
});