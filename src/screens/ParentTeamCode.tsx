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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { supabase } from '../services/supabase';
import { Ionicons } from '@expo/vector-icons';

type ParentTeamCodeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ParentTeamCode'>;
type ParentTeamCodeRouteProp = RouteProp<RootStackParamList, 'ParentTeamCode'>;

export const ParentTeamCodeScreen = () => {
  const navigation = useNavigation<ParentTeamCodeNavigationProp>();
  const route = useRoute<ParentTeamCodeRouteProp>();
  const { phone, isNewUser } = route.params;

  const [teamCode, setTeamCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!teamCode.trim()) {
      Alert.alert('Error', 'Please enter the team code');
      return;
    }

    setLoading(true);
    try {
      // Check if team exists with the given code
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select('id')
        .eq('access_code', teamCode)
        .single();

      if (teamError) {
        if (teamError.code === 'PGRST116') {
          Alert.alert('Error', 'Invalid team code. Please check with your team coach.');
        } else {
          throw teamError;
        }
        return;
      }

      if (isNewUser) {
        // New parent - go to setup screen
        navigation.navigate('ParentSetup', { phone, teamCode });
      } else {
        // Existing parent - go to password screen
        navigation.navigate('ParentPassword', { phone });
      }
    } catch (error: any) {
      console.error('Error checking team code:', error);
      Alert.alert('Error', 'Failed to verify team code. Please try again.');
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

      <Text style={styles.title}>Enter Team Code</Text>
      <Text style={styles.subtitle}>
        {isNewUser
          ? 'Enter the team code provided by your coach'
          : 'Verify your team code to continue'}
      </Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Team Code"
          value={teamCode}
          onChangeText={setTeamCode}
          autoCapitalize="characters"
          autoCorrect={false}
        />

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.continueButtonText}>Continue</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.helpText}>
          Contact your team coach if you don't have the team code
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
  },
  continueButton: {
    backgroundColor: '#ff9500',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  continueButtonText: {
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