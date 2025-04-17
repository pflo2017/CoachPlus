import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

type CoachLoginNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CoachLogin'>;

export const CoachLoginScreen = () => {
  const navigation = useNavigation<CoachLoginNavigationProp>();
  const { signIn } = useAuth();
  
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!accessCode.trim()) {
      Alert.alert('Error', 'Please enter your access code');
      return;
    }

    setLoading(true);
    try {
      // Find coach by access code
      const { data: coachData, error: coachError } = await supabase
        .from('coaches')
        .select('*')
        .eq('access_code', accessCode.toUpperCase())
        .single();

      if (coachError || !coachData) {
        throw new Error('Invalid access code');
      }

      // Get coach's auth account
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', coachData.user_id)
        .single();

      if (userError || !userData) {
        throw new Error('Coach account not found');
      }

      // Sign in using the coach's credentials
      const { error: signInError } = await signIn(userData.email, accessCode);
      if (signInError) throw signInError;

    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert('Error', error.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#4a90e2" />
      </TouchableOpacity>

      <Text style={styles.title}>Coach Login</Text>
      <Text style={styles.subtitle}>Enter your access code to continue</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Access Code"
          value={accessCode}
          onChangeText={setAccessCode}
          autoCapitalize="characters"
          autoCorrect={false}
        />

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.helpText}>
          Contact your club administrator if you don't have an access code
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  backButton: {
    marginTop: 40,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    textAlign: 'center',
    letterSpacing: 2,
  },
  loginButton: {
    backgroundColor: '#50c878',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  helpText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginTop: 16,
  },
}); 