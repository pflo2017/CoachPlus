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
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

type ClubInformationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ClubInformation'>;

interface ClubInformation {
  id: string;
  name: string;
  location: string;
  logo: string | null;
}

export const ClubInformationScreen = () => {
  const navigation = useNavigation<ClubInformationScreenNavigationProp>();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [clubInfo, setClubInfo] = useState<ClubInformation>({
    id: '',
    name: '',
    location: '',
    logo: null
  });
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);

  useEffect(() => {
    loadClubInformation();
  }, []);

  const loadClubInformation = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      const { data: club, error } = await supabase
        .from('clubs')
        .select('id, name, location, logo')
        .eq('admin_id', userData.user.id)
        .single();

      if (error) {
        console.error('Error fetching club:', error);
        // If no club found, create one with metadata
        const { data: newClub, error: insertError } = await supabase
          .from('clubs')
          .insert([
            {
              admin_id: userData.user.id,
              name: userData.user.user_metadata.club_name || '',
              location: userData.user.user_metadata.club_location || '',
              logo: null
            }
          ])
          .select()
          .single();

        if (insertError) {
          console.error('Error creating club:', insertError);
          return;
        }

        setClubInfo({
          id: newClub.id,
          name: newClub.name,
          location: newClub.location,
          logo: newClub.logo
        });
        return;
      }

      setClubInfo({
        id: club.id,
        name: club.name,
        location: club.location,
        logo: club.logo
      });
    } catch (error) {
      console.error('Error in loadClubInformation:', error);
    } finally {
      setLoading(false);
    }
  };

  const pickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        const fileSize = result.assets[0].fileSize;
        if (fileSize && fileSize > 2 * 1024 * 1024) {
          Alert.alert(
            'Image too large',
            'Please select an image smaller than 2MB',
            [{ text: 'OK' }]
          );
          return;
        }
        setClubInfo({ ...clubInfo, logo: result.assets[0].uri });
        setShowImagePickerModal(false);
      }
    } catch (error) {
      console.error('Error picking image from gallery:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const pickFromFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true
      });

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const fileSize = asset.size;
        if (fileSize && fileSize > 2 * 1024 * 1024) {
          Alert.alert(
            'Image too large',
            'Please select an image smaller than 2MB',
            [{ text: 'OK' }]
          );
          return;
        }

        const fileExt = asset.name?.split('.').pop()?.toLowerCase();
        if (!['jpg', 'jpeg', 'png', 'gif'].includes(fileExt || '')) {
          Alert.alert(
            'Invalid file type',
            'Please select a valid image file (JPG, JPEG, PNG, or GIF)',
            [{ text: 'OK' }]
          );
          return;
        }

        setClubInfo({ ...clubInfo, logo: asset.uri });
        setShowImagePickerModal(false);
      }
    } catch (error) {
      console.error('Error picking file:', error);
      Alert.alert('Error', 'Failed to pick file. Please try again.');
    }
  };

  const handleSave = async () => {
    if (!clubInfo.name.trim()) {
      Alert.alert('Error', 'Please enter your club name');
      return;
    }

    if (!clubInfo.location.trim()) {
      Alert.alert('Error', 'Please enter your club location');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('clubs')
        .update({
          name: clubInfo.name,
          location: clubInfo.location,
          logo: clubInfo.logo
        })
        .eq('id', clubInfo.id);

      if (error) throw error;
      Alert.alert('Success', 'Club information updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating club information:', error);
      Alert.alert('Error', 'Failed to update club information');
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
        onPress={() => setShowImagePickerModal(true)}
      >
        {clubInfo.logo ? (
          <Image
            source={{ uri: clubInfo.logo }}
            style={styles.clubLogo}
          />
        ) : (
          <View style={styles.logoPlaceholder}>
            <Ionicons name="camera" size={40} color="#999" />
            <Text style={styles.logoText}>Add Club Logo</Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal
        visible={showImagePickerModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImagePickerModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose Image Source</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={pickFromGallery}
            >
              <Ionicons name="images" size={24} color="#4a90e2" />
              <Text style={styles.modalButtonText}>Photo Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={pickFromFiles}
            >
              <Ionicons name="folder" size={24} color="#4a90e2" />
              <Text style={styles.modalButtonText}>Files</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowImagePickerModal(false)}
            >
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Club Name</Text>
          <TextInput
            style={styles.input}
            value={clubInfo.name}
            onChangeText={(text) => setClubInfo({ ...clubInfo, name: text })}
            placeholder="Enter club name"
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Club Location (City)</Text>
          <TextInput
            style={styles.input}
            value={clubInfo.location}
            onChangeText={(text) => setClubInfo({ ...clubInfo, location: text })}
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
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  clubLogo: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  logoPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4a90e2',
    borderStyle: 'dashed',
  },
  logoText: {
    marginTop: 8,
    color: '#4a90e2',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
  },
  modalButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  modalCancelButton: {
    marginTop: 10,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  modalCancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
}); 