import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { AdminTabParamList } from '../../navigation/types';

type PlayerDetailsScreenRouteProp = RouteProp<AdminTabParamList, 'PlayerDetails'>;

export const PlayerDetailsScreen = () => {
  const route = useRoute<PlayerDetailsScreenRouteProp>();
  const { playerId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Player Details</Text>
      <Text style={styles.playerId}>Player ID: {playerId}</Text>
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
  playerId: {
    fontSize: 16,
    color: '#666',
  },
}); 