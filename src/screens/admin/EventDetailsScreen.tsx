import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { AdminTabParamList } from '../../navigation/types';

type EventDetailsScreenRouteProp = RouteProp<AdminTabParamList, 'EventDetails'>;

export const EventDetailsScreen = () => {
  const route = useRoute<EventDetailsScreenRouteProp>();
  const { eventId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Event Details</Text>
      <Text style={styles.eventId}>Event ID: {eventId}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  eventId: {
    fontSize: 16,
    color: '#666',
  },
}); 