import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface SettingsItemProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  description?: string;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  title,
  icon,
  onPress,
  description,
}) => (
  <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
    <View style={styles.settingsItemContent}>
      <View style={styles.settingsItemLeft}>
        <Ionicons name={icon} size={24} color="#666" />
        <View style={styles.settingsItemTextContainer}>
          <Text style={styles.settingsItemTitle}>{title}</Text>
          {description && (
            <Text style={styles.settingsItemDescription}>{description}</Text>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#666" />
    </View>
  </TouchableOpacity>
);

export const SettingsScreen = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="settings" size={24} color="#666" />
          <Text style={styles.title}>Settings</Text>
        </View>
        <Text style={styles.subtitle}>Manage your account and preferences</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Club Management</Text>
        <SettingsItem
          title="Club Information"
          icon="business"
          description="Update your club's details and logo"
          onPress={() => navigation.navigate('ClubInformation')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <SettingsItem
          title="Admin Profile"
          icon="person"
          description="Edit your personal information"
          onPress={() => navigation.navigate('AdminProfile')}
        />
        <SettingsItem
          title="Security"
          icon="lock-closed"
          description="Update password and notification preferences"
          onPress={() => navigation.navigate('Security')}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  section: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginHorizontal: 20,
    marginVertical: 15,
  },
  settingsItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  settingsItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsItemTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  settingsItemDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
}); 