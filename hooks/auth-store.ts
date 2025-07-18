import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import createContextHook from "@nkzw/create-context-hook";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { supabase } from "@/lib/supabase";

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: 'user' | 'admin';
}

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  // Check for existing session on app start
  useEffect(() => {
    checkAuthState();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session?.user) {
          // Get user data from users table
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching user data:', error);
            // Create user record if it doesn't exist
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
                avatar: session.user.user_metadata?.avatar_url,
                role: 'user',
              });

            if (insertError) {
              console.error('Error creating user record:', insertError);
            }

            // Set default user data
            const newUser: User = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
              avatar: session.user.user_metadata?.avatar_url,
              role: 'user',
            };
            setUser(newUser);
            await AsyncStorage.setItem('user', JSON.stringify(newUser));
          } else {
            const userWithRole: User = {
              id: userData.id,
              email: userData.email,
              name: userData.name,
              avatar: userData.avatar,
              role: userData.role,
            };
            setUser(userWithRole);
            await AsyncStorage.setItem('user', JSON.stringify(userWithRole));
          }
        } else {
          setUser(null);
          await AsyncStorage.removeItem('user');
          // Clear all cached data when user logs out
          queryClient.clear();
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);

  const checkAuthState = async () => {
    try {
      // Check for stored user data
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      // Check current session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        setIsLoading(false);
        return;
      }

      if (session?.user) {
        // Get user data from users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError);
          // Create user record if it doesn't exist
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
              avatar: session.user.user_metadata?.avatar_url,
              role: 'user',
            });

          if (insertError) {
            console.error('Error creating user record:', insertError);
          }

          // Set default user data
          const newUser: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0],
            avatar: session.user.user_metadata?.avatar_url,
            role: 'user',
          };
          setUser(newUser);
          await AsyncStorage.setItem('user', JSON.stringify(newUser));
        } else {
          const userWithRole: User = {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            avatar: userData.avatar,
            role: userData.role,
          };
          setUser(userWithRole);
          await AsyncStorage.setItem('user', JSON.stringify(userWithRole));
        }
      } else {
        setUser(null);
        await AsyncStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up mutation
  const signUpMutation = useMutation({
    mutationFn: async ({ email, password, name }: { email: string; password: string; name: string }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) throw error;
      return data;
    },
  });

  // Sign in mutation
  const signInMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    },
  });

  // Sign out mutation
  const signOutMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      setUser(null);
      AsyncStorage.removeItem('user');
      queryClient.clear();
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async ({ name, avatar }: { name?: string; avatar?: string }) => {
      if (!user) throw new Error('User not authenticated');

      // Update auth user metadata
      const { data, error } = await supabase.auth.updateUser({
        data: { name, avatar_url: avatar },
      });

      if (error) throw error;

      // Update users table
      const { error: updateError } = await supabase
        .from('users')
        .update({
          name: name || user.name,
          avatar: avatar || user.avatar,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      return data;
    },
    onSuccess: (data) => {
      if (data.user && user) {
        const updatedUser: User = {
          ...user,
          name: data.user.user_metadata?.name || user.name,
          avatar: data.user.user_metadata?.avatar_url || user.avatar,
        };
        setUser(updatedUser);
        AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      }
    },
  });

  const signUp = async (email: string, password: string, name: string) => {
    return signUpMutation.mutateAsync({ email, password, name });
  };

  const signIn = async (email: string, password: string) => {
    return signInMutation.mutateAsync({ email, password });
  };

  const signOut = async () => {
    return signOutMutation.mutateAsync();
  };

  const updateProfile = async (name?: string, avatar?: string) => {
    return updateProfileMutation.mutateAsync({ name, avatar });
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    signUp,
    signIn,
    signOut,
    updateProfile,
    isSigningUp: signUpMutation.isPending,
    isSigningIn: signInMutation.isPending,
    isSigningOut: signOutMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,
  };
});