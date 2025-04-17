export default {
  name: 'CoachPlus',
  slug: 'coachplus',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.p.florin.CoachPlus'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    package: 'com.p.florin.CoachPlus'
  },
  web: {
    favicon: './assets/favicon.png'
  },
  plugins: [
    'expo-font',
    'expo-splash-screen'
  ],
  extra: {
    supabaseUrl: process.env.SUPABASE_URL || 'https://qblpvbfljkflzxkvkhnm.supabase.co',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFibHB2YmZsamtmbHp4a3ZraG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MDU4MTksImV4cCI6MjA2MDM4MTgxOX0.uKg5kU-ni4UipnrA-1HMXXZWuAJPFVNv12jfFGVR7HE',
  }
}; 