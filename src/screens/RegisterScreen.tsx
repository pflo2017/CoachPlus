import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;
type RegisterScreenRouteProp = RouteProp<RootStackParamList, 'Register'>;

export const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const route = useRoute<RegisterScreenRouteProp>();
  const { signIn } = useAuth();

  // Common fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Admin specific fields
  const [clubName, setClubName] = useState('');
  const [clubLocation, setClubLocation] = useState('');
  const [adminName, setAdminName] = useState('');
  const [clubLogo, setClubLogo] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const pickImage = async (type: 'logo' | 'profile') => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: type === 'profile' ? [1, 1] : [16, 9],
        quality: 0.3,
      });

      if (!result.canceled) {
        const fileSize = result.assets[0].fileSize;
        if (fileSize && fileSize > 2 * 1024 * 1024) {
          Alert.alert(
            'Image too large',
            'Please select an image smaller than 2MB',
            [{ text: 'OK' }]
          );
          return;
        }

        if (type === 'logo') {
          setClubLogo(result.assets[0].uri);
        } else {
          setProfilePicture(result.assets[0].uri);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const uploadImage = async (uri: string, bucket: 'club-logos' | 'profile-pictures', userId: string, type: 'logo' | 'profile') => {
    try {
      // First convert the image to base64 to ensure we have the full data
      const response = await fetch(uri);
      const blob = await response.blob();
      
      // Generate a more unique filename to avoid conflicts
      const timestamp = new Date().getTime();
      const randomString = Math.random().toString(36).substring(7);
      const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${userId}/${type}_${timestamp}_${randomString}.${fileExt}`;
      
      // Add retries for upload
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          const { data, error } = await supabase.storage
            .from(bucket)
            .upload(fileName, blob, {
              contentType: `image/${fileExt}`,
              cacheControl: '3600',
              upsert: true
            });

          if (error) {
            console.error(`Upload attempt ${retryCount + 1} failed:`, error);
            retryCount++;
            if (retryCount === maxRetries) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
            continue;
          }

          // If upload successful, return the path
          return data?.path || null;
        } catch (uploadError) {
          console.error(`Upload attempt ${retryCount + 1} failed:`, uploadError);
          retryCount++;
          if (retryCount === maxRetries) throw uploadError;
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
        }
      }
      
      throw new Error('Failed to upload after multiple attempts');
    } catch (error: any) {
      console.error(`Error uploading ${type}:`, error);
      throw new Error(`Failed to upload ${type}. Please try again with a smaller image.`);
    }
  };

  const handleRegister = async () => {
    if (route.params.role === 'admin') {
      if (!clubName || !clubLocation || !adminName || !email || !password || !confirmPassword) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      // Step 1: Check if email exists in auth
      const { data: { users }, error: existingAuthError } = await supabase.auth.admin.listUsers();
      const existingAuthUser = users?.find(user => user.email === email);
      
      if (existingAuthUser) {
        throw new Error('An account with this email already exists');
      }

      // Step 2: Create auth user
      console.log('Creating auth user with email:', email);
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: route.params.role,
            name: route.params.role === 'admin' ? adminName : email,
            club_name: route.params.role === 'admin' ? clubName : null,
            club_location: route.params.role === 'admin' ? clubLocation : null
          }
        }
      });

      if (authError) {
        console.error('Auth Error:', authError);
        throw new Error(`Authentication failed: ${authError.message}`);
      }

      if (!authData.user) {
        throw new Error('Failed to create user account: No user data received');
      }

      const userId = authData.user.id;
      console.log('Auth user created successfully with ID:', userId);

      // Step 3: Upload images if provided
      let profilePicturePath = null;
      let clubLogoPath = null;

      if (profilePicture) {
        try {
          profilePicturePath = await uploadImage(profilePicture, 'profile-pictures', userId, 'profile');
        } catch (error) {
          console.error('Failed to upload profile picture:', error);
          // Continue without profile picture
        }
      }

      if (route.params.role === 'admin' && clubLogo) {
        try {
          clubLogoPath = await uploadImage(clubLogo, 'club-logos', userId, 'logo');
        } catch (error) {
          console.error('Failed to upload club logo:', error);
          // Continue without club logo
        }
      }

      // Step 4: Create user profile
      console.log('Creating user profile...');
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: email,
          role: route.params.role,
          name: route.params.role === 'admin' ? adminName : email,
          profile_picture_url: profilePicturePath
        });

      if (profileError) {
        console.error('Profile Creation Error:', profileError);
        // Clean up: Delete auth user
        await supabase.auth.admin.deleteUser(userId);
        throw new Error(`Failed to create user profile: ${profileError.message}`);
      }

      // Step 5: If admin, create club
      if (route.params.role === 'admin') {
        console.log('Creating club for admin...');
        const { error: clubError } = await supabase
          .from('clubs')
          .insert({
            admin_id: userId,
            name: clubName,
            location: clubLocation,
            logo_url: clubLogoPath
          });

        if (clubError) {
          console.error('Club Creation Error:', clubError);
          // Clean up: Delete user profile and auth user
          await supabase.from('users').delete().eq('id', userId);
          await supabase.auth.admin.deleteUser(userId);
          throw new Error(`Failed to create club: ${clubError.message}`);
        }
      }

      // Success!
      Alert.alert(
        'Success!',
        'Your account has been created successfully. Please login with your credentials.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login', { role: route.params.role }),
          },
        ]
      );
    } catch (error: any) {
      console.error('Registration Error:', error);
      Alert.alert(
        'Registration Error',
        error.message || 'An unexpected error occurred during registration. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#4a90e2" />
      </TouchableOpacity>

      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>
        Register as {route.params.role.charAt(0).toUpperCase() + route.params.role.slice(1)}
      </Text>

      <View style={styles.form}>
        {route.params.role === 'admin' && (
          <>
            <Text style={styles.sectionTitle}>Club Information</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Club Name *"
              value={clubName}
              onChangeText={setClubName}
            />

            <TextInput
              style={styles.input}
              placeholder="Club Location (City) *"
              value={clubLocation}
              onChangeText={setClubLocation}
            />

            <TouchableOpacity
              style={styles.imageButton}
              onPress={() => pickImage('logo')}
            >
              {clubLogo ? (
                <Image source={{ uri: clubLogo }} style={styles.previewImage} />
              ) : (
                <View style={styles.uploadContainer}>
                  <Ionicons name="cloud-upload" size={24} color="#4a90e2" />
                  <Text style={styles.uploadText}>Upload Club Logo (Optional)</Text>
                </View>
              )}
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Administrator Information</Text>

            <TextInput
              style={styles.input}
              placeholder="Administrator Name *"
              value={adminName}
              onChangeText={setAdminName}
            />

            <TouchableOpacity
              style={styles.profileImageButton}
              onPress={() => pickImage('profile')}
            >
              {profilePicture ? (
                <Image source={{ uri: profilePicture }} style={styles.profilePreviewImage} />
              ) : (
                <View style={styles.uploadContainer}>
                  <Ionicons name="person-circle" size={24} color="#4a90e2" />
                  <Text style={styles.uploadText}>Upload Profile Picture (Optional)</Text>
                </View>
              )}
            </TouchableOpacity>
          </>
        )}

        <Text style={styles.sectionTitle}>Account Information</Text>

        <TextInput
          style={styles.input}
          placeholder="Email *"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password *"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="none"
          autoComplete="off"
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password *"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          textContentType="none"
          autoComplete="off"
        />

        <TouchableOpacity
          style={styles.registerButton}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.registerButtonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    marginTop: 40,
    marginLeft: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
    marginBottom: 16,
  },
  form: {
    padding: 20,
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
  imageButton: {
    height: 120,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  uploadContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  uploadText: {
    color: '#666',
    fontSize: 14,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileImageButton: {
    height: 120,
    width: 120,
    backgroundColor: 'white',
    borderRadius: 60,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    overflow: 'hidden',
    alignSelf: 'center',
  },
  profilePreviewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 60,
  },
  registerButton: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loginButton: {
    padding: 15,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#4a90e2',
    fontSize: 16,
  },
}); 