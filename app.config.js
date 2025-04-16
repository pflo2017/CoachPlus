module.exports = {
  name: 'CoachPlus',
  slug: 'coach-plus',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.coachplus.app'
  },
  android: {
    package: 'com.coachplus.app'
  },
  plugins: [
    'expo-image-picker'
  ],
  extra: {
    supabaseUrl: process.env.SUPABASE_URL || 'https://qblpvbfljkflzxkvkhnm.supabase.co',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFibHB2YmZsamtmbHp4a3ZraG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MDU4MTksImV4cCI6MjA2MDM4MTgxOX0.uKg5kU-ni4UipnrA-1HMXXZWuAJPFVNv12jfFGVR7HE',
  }
}; 