import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://jzaxgacpgzxjsdgwtsqh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6YXhnYWNwZ3p4anNkZ3d0c3FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NzM0NzUsImV4cCI6MjA2ODQ0OTQ3NX0.jhhjpH8HgVnFN5tTV0pWQHtKOeaNf71kHQBij4HgdXs';


export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Here is the magic!
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // This is important for mobile auth flows
  },
});