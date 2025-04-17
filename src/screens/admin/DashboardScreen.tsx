import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { RootStackParamList } from '../../types';

type DashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type StatsCardProps = {
  icon: React.ReactNode;
  title: string;
  value: number;
  subtitle: string;
  bgColor: string;
  newCount?: number;
  onPress?: () => void;
};

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.iconWrapper}>{children}</View>
);

const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  title,
  value,
  subtitle,
  bgColor,
  newCount,
  onPress,
}) => (
  <TouchableOpacity 
    style={[styles.statsCard, { backgroundColor: bgColor }]}
    onPress={onPress}
  >
    <View style={styles.statsContent}>
      <View style={styles.statsHeader}>
        <IconWrapper>{icon}</IconWrapper>
        {newCount !== undefined && newCount > 0 && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>+{newCount}</Text>
          </View>
        )}
      </View>
      <Text style={styles.statsValue}>{value}</Text>
      <Text style={styles.statsTitle}>{title}</Text>
      <Text style={styles.statsSubtitle}>{subtitle}</Text>
    </View>
  </TouchableOpacity>
);

const QuickActionButton: React.FC<{
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
}> = ({ icon, title, onPress }) => (
  <TouchableOpacity style={styles.quickActionButton} onPress={onPress}>
    <IconWrapper>{icon}</IconWrapper>
    <Text style={styles.quickActionText}>{title}</Text>
  </TouchableOpacity>
);

export default function DashboardScreen() {
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const { user, signOut } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleProfilePress = () => {
    setShowProfileMenu(true);
  };

  const handleEditProfile = () => {
    setShowProfileMenu(false);
    // Navigate to profile edit screen
    navigation.navigate('Settings');
  };

  const handleLogout = async () => {
    setShowProfileMenu(false);
    await signOut();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentInsetAdjustmentBehavior="automatic">
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>TS</Text>
            <Text style={styles.appName}>TeamSync</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton}>
              <IconWrapper>
                <Ionicons name="search" size={24} color="#333" />
              </IconWrapper>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>3</Text>
              </View>
              <IconWrapper>
                <Ionicons name="notifications" size={24} color="#333" />
              </IconWrapper>
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileButton} onPress={handleProfilePress}>
              <View style={styles.profileImage} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.title}>Dashboard</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatsCard
              icon={<Ionicons name="people" size={24} color="#4169E1" />}
              title="Total Players"
              value={0}
              subtitle="Registered in your academy"
              bgColor="#F0FFF0"
            />
            <StatsCard
              icon={<Ionicons name="people" size={24} color="#4169E1" />}
              title="Total Teams"
              value={0}
              subtitle="Active in your academy"
              bgColor="#F0F8FF"
              newCount={0}
            />
          </View>
          <View style={styles.statsRow}>
            <StatsCard
              icon={<Ionicons name="person" size={24} color="#4169E1" />}
              title="Total Coaches"
              value={0}
              subtitle="Active in your academy"
              bgColor="#FFF0F5"
            />
            <StatsCard
              icon={<Ionicons name="card" size={24} color="#4169E1" />}
              title="Payment status"
              value={0}
              subtitle="Monthly unpaid memberships"
              bgColor="#FFF0F0"
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <QuickActionButton
            icon={
              <View style={[styles.actionIcon, styles.addIcon]}>
                <IconWrapper>
                  <Ionicons name="add" size={24} color="#FFF" />
                </IconWrapper>
              </View>
            }
            title="Add Post"
            onPress={() => {}}
          />
          <QuickActionButton
            icon={
              <View style={[styles.actionIcon, styles.searchIcon]}>
                <IconWrapper>
                  <Ionicons name="search" size={24} color="#FFF" />
                </IconWrapper>
              </View>
            }
            title="Search Player"
            onPress={() => {}}
          />
        </View>

        <View style={styles.announcementsSection}>
          <View style={styles.announcementsHeader}>
            <Text style={styles.sectionTitle}>Recent Announcements</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>Latest updates and notices</Text>
          <View style={styles.emptyAnnouncements}>
            <Text style={styles.emptyText}>No announcements yet</Text>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showProfileMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowProfileMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowProfileMenu(false)}
        >
          <View style={styles.profileMenu}>
            <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
              <Ionicons name="person-circle-outline" size={24} color="#333" />
              <Text style={styles.menuItemText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
              <Text style={[styles.menuItemText, styles.logoutText]}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    backgroundColor: '#4169E1',
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    padding: 8,
    borderRadius: 10,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#000',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  notificationText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileButton: {
    marginLeft: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E5EA',
    borderRadius: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 16,
    paddingHorizontal: 16,
    color: '#000',
  },
  statsGrid: {
    paddingHorizontal: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statsCard: {
    width: cardWidth,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statsContent: {
    alignItems: 'flex-start',
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  statsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  statsSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  newBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 16,
    paddingHorizontal: 16,
    color: '#000',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
  },
  quickActionText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    backgroundColor: '#4169E1',
  },
  searchIcon: {
    backgroundColor: '#34C759',
  },
  announcementsSection: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  announcementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  viewAllText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  emptyAnnouncements: {
    backgroundColor: '#F2F2F7',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  profileMenu: {
    position: 'absolute',
    top: 100,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 180,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  menuItemText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  logoutText: {
    color: '#FF3B30',
  },
}); 