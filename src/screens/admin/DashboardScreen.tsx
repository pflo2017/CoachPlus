import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminTabParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<AdminTabParamList>;

interface DashboardStats {
  totalTeams: number;
  totalPlayers: number;
  totalCoaches: number;
  totalUnpaidMemberships: number;
  newTeams: number;
}

export const DashboardScreen = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchDashboardStats();
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      // Get club ID
      const { data: clubData, error: clubError } = await supabase
        .from('clubs')
        .select('id')
        .eq('admin_id', user?.id)
        .single();

      if (clubError) throw clubError;

      // Get total teams and new teams (created in the last 30 days)
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('created_at')
        .eq('club_id', clubData.id);

      if (teamsError) throw teamsError;

      const newTeams = teamsData?.filter(team => {
        const createdAt = new Date(team.created_at);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return createdAt >= thirtyDaysAgo;
      }).length || 0;

      // Get total players
      const { count: playersCount, error: playersError } = await supabase
        .from('players')
        .select('*', { count: 'exact' })
        .in('team_id', 
          (await supabase.from('teams').select('id').eq('club_id', clubData.id)).data?.map(t => t.id) || []
        );

      if (playersError) throw playersError;

      // Get total coaches
      const { count: coachesCount, error: coachesError } = await supabase
        .from('coaches')
        .select('*', { count: 'exact' });

      if (coachesError) throw coachesError;

      // Get unpaid memberships
      const { data: unpaidPayments, error: paymentsError } = await supabase
        .from('payments')
        .select('id')
        .eq('status', 'pending')
        .eq('month', new Date().toLocaleString('default', { month: 'long' }))
        .eq('year', new Date().getFullYear().toString());

      if (paymentsError) throw paymentsError;

      setStats({
        totalTeams: teamsData?.length || 0,
        totalPlayers: playersCount || 0,
        totalCoaches: coachesCount || 0,
        totalUnpaidMemberships: unpaidPayments?.length || 0,
        newTeams: newTeams,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
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
      <Text style={styles.title}>Dashboard</Text>
      
      <View style={styles.cardsContainer}>
        <TouchableOpacity style={[styles.card, styles.playersCard]} onPress={() => navigation.navigate('Players')}>
          <Ionicons name="people" size={24} color="#4a90e2" />
          <Text style={styles.cardTitle}>Total Players</Text>
          <Text style={styles.cardValue}>{stats?.totalPlayers || 0}</Text>
          <Text style={styles.cardSubtext}>Registered in your academy</Text>
          <Ionicons name="chevron-forward" size={24} color="#4a90e2" style={styles.cardArrow} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, styles.teamsCard]} onPress={() => navigation.navigate('Teams')}>
          <Ionicons name="people-circle" size={24} color="#4a90e2" />
          <Text style={styles.cardTitle}>Total Teams</Text>
          <View style={styles.teamStatsContainer}>
            <Text style={styles.cardValue}>{stats?.totalTeams || 0}</Text>
            {stats?.newTeams ? (
              <View style={styles.newTeamsBadge}>
                <Text style={styles.newTeamsText}>+{stats.newTeams} new</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.cardSubtext}>Active in your academy</Text>
          <Ionicons name="chevron-forward" size={24} color="#4a90e2" style={styles.cardArrow} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, styles.coachesCard]} onPress={() => navigation.navigate('Coaches')}>
          <Ionicons name="person" size={24} color="#4a90e2" />
          <Text style={styles.cardTitle}>Total Coaches</Text>
          <Text style={styles.cardValue}>{stats?.totalCoaches || 0}</Text>
          <Text style={styles.cardSubtext}>Active in your academy</Text>
          <Ionicons name="chevron-forward" size={24} color="#4a90e2" style={styles.cardArrow} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, styles.paymentsCard]} onPress={() => navigation.navigate('Payments')}>
          <Ionicons name="card" size={24} color="#4a90e2" />
          <Text style={styles.cardTitle}>Payment status</Text>
          <Text style={styles.cardValue}>{stats?.totalUnpaidMemberships || 0}</Text>
          <Text style={[styles.cardSubtext, styles.unpaidText]}>Monthly unpaid memberships</Text>
          <Ionicons name="chevron-forward" size={24} color="#4a90e2" style={styles.cardArrow} />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('CreatePost')}>
          <View style={[styles.actionIcon, { backgroundColor: '#8A4FFF' }]}>
            <Ionicons name="add" size={24} color="white" />
          </View>
          <Text style={styles.actionText}>Add Post</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('PaymentStatus')}>
          <View style={[styles.actionIcon, { backgroundColor: '#FFB930' }]}>
            <Ionicons name="cash" size={24} color="white" />
          </View>
          <Text style={styles.actionText}>Payment Status</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('SearchPlayer')}>
          <View style={[styles.actionIcon, { backgroundColor: '#FF6B6B' }]}>
            <Ionicons name="search" size={24} color="white" />
          </View>
          <Text style={styles.actionText}>Search Player</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.announcementsContainer}>
        <View style={styles.announcementsHeader}>
          <Text style={styles.sectionTitle}>Recent Announcements</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Announcements')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.announcementsSubtext}>Latest updates and notices</Text>
      </View>
    </ScrollView>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1a1a1a',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 24,
  },
  card: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  playersCard: {
    backgroundColor: '#F0F7FF',
  },
  teamsCard: {
    backgroundColor: '#F0F4FF',
  },
  coachesCard: {
    backgroundColor: '#FFF0F0',
  },
  paymentsCard: {
    backgroundColor: '#FFF0F0',
  },
  cardTitle: {
    fontSize: 16,
    color: '#4a4a4a',
    marginTop: 8,
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginVertical: 4,
  },
  cardSubtext: {
    fontSize: 14,
    color: '#666',
  },
  unpaidText: {
    color: '#FF6B6B',
  },
  cardArrow: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -12,
  },
  teamStatsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  newTeamsBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newTeamsText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1a1a1a',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    alignItems: 'center',
    width: '30%',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#4a4a4a',
    textAlign: 'center',
  },
  announcementsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  announcementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  viewAllText: {
    color: '#4a90e2',
    fontSize: 14,
    fontWeight: '600',
  },
  announcementsSubtext: {
    fontSize: 14,
    color: '#666',
  },
}); 