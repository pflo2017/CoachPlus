import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Replace these with your Supabase project URL and anon key from:
// Project Settings > API > Project API keys
const supabaseUrl = 'https://qblpvbfljkflzxkvkhnm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFibHB2YmZsamtmbHp4a3ZraG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MDU4MTksImV4cCI6MjA2MDM4MTgxOX0.uKg5kU-ni4UipnrA-1HMXXZWuAJPFVNv12jfFGVR7HE';

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
); 