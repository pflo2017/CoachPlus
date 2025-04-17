import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';
import { Team } from '../../types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  TeamDetails: { teamId: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const TeamsScreen = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    fetchTeams();
  }, [user]);

  const fetchTeams = async () => {
    try {
      // Get club ID
      const { data: clubData, error: clubError } = await supabase
        .from('clubs')
        .select('id')
        .eq('admin_id', user?.id);

      if (clubError) throw clubError;

      if (!clubData || clubData.length === 0) {
        setTeams([]);
        return;
      }

      // Get teams
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select(`
          *,
          coaches:coach_id(name, phone),
          players:players(count)
        `)
        .eq('club_id', clubData[0].id);

      if (teamsError) throw teamsError;

      setTeams(teamsData || []);
    } catch (error: any) {
      console.error('Error fetching teams:', error);
      Alert.alert('Error', error.message || 'Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async () => {
    try {
      if (!newTeamName.trim()) {
        Alert.alert('Error', 'Please enter a team name');
        return;
      }

      // Get club ID
      const { data: clubData, error: clubError } = await supabase
        .from('clubs')
        .select('id')
        .eq('admin_id', user?.id)
        .single();

      if (clubError) throw clubError;

      // Generate access code
      const accessCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      // Create team
      const { error: createError } = await supabase
        .from('teams')
        .insert({
          name: newTeamName,
          access_code: accessCode,
          club_id: clubData.id,
        });

      if (createError) throw createError;

      setNewTeamName('');
      setShowCreateTeam(false);
      fetchTeams();
      Alert.alert('Success', 'Team created successfully!');
    } catch (error) {
      console.error('Error creating team:', error);
      Alert.alert('Error', 'Failed to create team');
    }
  };

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTeamItem = ({ item }: { item: Team }) => (
    <TouchableOpacity
      style={styles.teamItem}
      onPress={() => navigation.navigate('TeamDetails', { teamId: item.id })}
    >
      <Text style={styles.teamName}>{item.name}</Text>
      <Text style={styles.teamInfo}>Access Code: {item.access_code}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Teams</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowCreateTeam(true)}
        >
          <Text style={styles.createButtonText}>Create Team</Text>
        </TouchableOpacity>
      </View>

      {showCreateTeam && (
        <View style={styles.createTeamContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter team name"
            value={newTeamName}
            onChangeText={setNewTeamName}
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleCreateTeam}
          >
            <Text style={styles.submitButtonText}>Create</Text>
          </TouchableOpacity>
        </View>
      )}

      <TextInput
        style={styles.searchInput}
        placeholder="Search teams..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {teams.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No teams yet</Text>
          <Text style={styles.emptySubtext}>Create your first team to get started</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTeams}
          renderItem={renderTeamItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  createButton: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  createButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  createTeamContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#4a90e2',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  teamItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  teamInfo: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
}); 