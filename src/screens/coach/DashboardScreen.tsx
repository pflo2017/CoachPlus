import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CoachTabParamList } from '../../navigation/types';

type DashboardScreenNavigationProp = NativeStackNavigationProp<CoachTabParamList, 'Dashboard'>;

export const CoachDashboardScreen = () => {
  const navigation = useNavigation<DashboardScreenNavigationProp>();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Coach Dashboard</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>My Teams</Text>
          <Text style={styles.cardText}>View and manage your teams</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Upcoming Events</Text>
          <Text style={styles.cardText}>View and manage upcoming events</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Player Management</Text>
          <Text style={styles.cardText}>Manage your players</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Announcements</Text>
          <Text style={styles.cardText}>View and create announcements</Text>
        </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
  },
}); 