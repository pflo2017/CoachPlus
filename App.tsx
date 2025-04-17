import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';
import { Navigation } from './src/navigation';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4a90e2" />
      </View>
    );
  }

  return <Navigation />;
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Ensure necessary directories exist
        const cacheDir = FileSystem.cacheDirectory + 'ExponentExperienceData';
        const docDir = FileSystem.documentDirectory + 'ExponentExperienceData';
        
        await Promise.all([
          FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true }),
          FileSystem.makeDirectoryAsync(docDir, { intermediates: true }),
          Font.loadAsync({
            ...Ionicons.font,
          }),
        ]);
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4a90e2" />
      </View>
    );
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <NavigationContainer>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
} 