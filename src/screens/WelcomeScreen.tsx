import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

export const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  const handleRoleSelection = (role: 'admin' | 'coach' | 'parent') => {
    switch (role) {
      case 'admin':
        navigation.navigate('Login', { role });
        break;
      case 'coach':
        navigation.navigate('CoachLogin');
        break;
      case 'parent':
        navigation.navigate('ParentPhoneEntry');
        break;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to CoachPlus</Text>
      <Text style={styles.subtitle}>Select your role to continue</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.adminButton]}
          onPress={() => handleRoleSelection('admin')}
        >
          <Text style={styles.buttonText}>I am a club administrator</Text>
          <Text style={styles.buttonSubtext}>Login with email and password</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.coachButton]}
          onPress={() => handleRoleSelection('coach')}
        >
          <Text style={styles.buttonText}>I am a coach</Text>
          <Text style={styles.buttonSubtext}>Login with access code</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.parentButton]}
          onPress={() => handleRoleSelection('parent')}
        >
          <Text style={styles.buttonText}>I am a parent</Text>
          <Text style={styles.buttonSubtext}>Login with phone number</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    gap: 20,
  },
  button: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  adminButton: {
    backgroundColor: '#4a90e2',
  },
  coachButton: {
    backgroundColor: '#50c878',
  },
  parentButton: {
    backgroundColor: '#ff9500',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  buttonSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
}); 