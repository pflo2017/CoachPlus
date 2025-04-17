import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

type ClubInformationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ClubInformation'>;

export const ClubInformationScreen = () => {
  const navigation = useNavigation<ClubInformationScreenNavigationProp>();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [clubName, setClubName] = useState('');
  const [clubLocation, setClubLocation] = useState('');
  const [clubLogo, setClubLogo] = useState<string | null>(null);

  useEffect(() => {
    loadClubInformation();
  }, []);

  const loadClubInformation = async () => {
    try {
      // First try to get existing club
      const { data: existingClub, error: fetchError } = await supabase
        .from('clubs')
        .select('name, location, logo_url')
        .eq('admin_id', user?.id)
        .maybeSingle();

      if (!existingClub) {
        // No club found, create a new one
        const { data: newClub, error: createError } = await supabase
          .from('clubs')
          .insert({
            admin_id: user?.id,
            name: '',
            location: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (createError) throw createError;

        if (newClub) {
          setClubName(newClub.name || '');
          setClubLocation(newClub.location || '');
          setClubLogo(null);
        }
      } else {
        // Club found, set the values
        setClubName(existingClub.name);
        setClubLocation(existingClub.location);
        if (existingClub.logo_url) {
          setClubLogo(existingClub.logo_url);
        }
      }
    } catch (error: any) {
      console.error('Error loading club information:', error);
      Alert.alert('Error', 'Failed to load club information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
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
        setClubLogo(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleSave = async () => {
    if (!clubName.trim()) {
      Alert.alert('Error', 'Please enter your club name');
      return;
    }

    if (!clubLocation.trim()) {
      Alert.alert('Error', 'Please enter your club location');
      return;
    }

    setSaving(true);
    try {
      let logo_url = clubLogo;
      if (clubLogo && clubLogo.startsWith('file://')) {
        try {
          const response = await fetch(clubLogo);
          const blob = await response.blob();
          const fileName = `club-logo-${user?.id}-${Date.now()}.jpg`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('club-logos')
            .upload(fileName, blob, {
              contentType: 'image/jpeg',
              upsert: true
            });

          if (uploadError) throw uploadError;

          if (uploadData) {
            const { data: { publicUrl } } = supabase.storage
              .from('club-logos')
              .getPublicUrl(uploadData.path);
            
            logo_url = publicUrl;
          }
        } catch (error) {
          console.error('Error uploading club logo:', error);
          Alert.alert('Error', 'Failed to upload club logo. Please try again.');
          return;
        }
      }

      const { error: updateError } = await supabase
        .from('clubs')
        .upsert({
          admin_id: user?.id,
          name: clubName,
          location: clubLocation,
          logo_url,
          updated_at: new Date().toISOString()
        })
        .eq('admin_id', user?.id);

      if (updateError) throw updateError;

      Alert.alert('Success', 'Club information updated successfully');
      navigation.goBack();
    } catch (error: any) {
      console.error('Error updating club information:', error);
      Alert.alert('Error', 'Failed to update club information. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="business" size={24} color="#666" />
          <Text style={styles.title}>Club Information</Text>
        </View>
        <Text style={styles.subtitle}>Update your club details</Text>
      </View>

      <TouchableOpacity
        style={styles.logoContainer}
        onPress={pickImage}
      >
        {clubLogo ? (
          <Image
            source={{ uri: clubLogo }}
            style={styles.clubLogo}
          />
        ) : (
          <View style={styles.logoPlaceholder}>
            <Ionicons name="camera" size={40} color="#999" />
            <Text style={styles.logoText}>Add Club Logo</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Club Name</Text>
          <TextInput
            style={styles.input}
            value={clubName}
            onChangeText={setClubName}
            placeholder="Enter club name"
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Club Location (City)</Text>
          <TextInput
            style={styles.input}
            value={clubLocation}
            onChangeText={setClubLocation}
            placeholder="Enter club location"
            autoCapitalize="words"
          />
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Club Information</Text>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  logoContainer: {
    alignSelf: 'center',
    marginVertical: 24,
  },
  clubLogo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  saveButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 