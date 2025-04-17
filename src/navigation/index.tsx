import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, AdminTabParamList, CoachTabParamList, ParentTabParamList } from './types';
import { useAuth } from '../context/AuthContext';

// Auth Screens
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { CoachLoginScreen } from '../screens/CoachLogin';
import { ParentPhoneEntryScreen } from '../screens/ParentPhoneEntry';
import { ParentTeamCodeScreen } from '../screens/ParentTeamCode';
import { ParentSetupScreen } from '../screens/ParentSetup';
import { ParentPasswordScreen } from '../screens/ParentPassword';

// Admin Screens
import DashboardScreen from '../screens/admin/DashboardScreen';
import { TeamsScreen } from '../screens/admin/TeamsScreen';
import { PlayersScreen } from '../screens/admin/PlayersScreen';
import { PaymentsScreen } from '../screens/admin/PaymentsScreen';
import { EventsScreen } from '../screens/admin/EventsScreen';
import { EventDetailsScreen } from '../screens/admin/EventDetailsScreen';
import { AnnouncementsScreen } from '../screens/admin/AnnouncementsScreen';
import { SettingsScreen } from '../screens/admin/SettingsScreen';
import { ClubInformationScreen } from '../screens/admin/ClubInformationScreen';
import { AdminProfileScreen } from '../screens/admin/AdminProfileScreen';
import { SecurityScreen } from '../screens/admin/SecurityScreen';

// Settings Screens
import { ProfileInformationScreen } from '../screens/ProfileInformationScreen';

// Coach Screens
import { CoachDashboardScreen } from '../screens/coach/DashboardScreen';
import { CoachTeamsScreen } from '../screens/coach/TeamsScreen';
import { CoachTeamDetailsScreen } from '../screens/coach/TeamDetailsScreen';
import { CoachPlayersScreen } from '../screens/coach/PlayersScreen';
import { CoachPlayerDetailsScreen } from '../screens/coach/PlayerDetailsScreen';
import { CoachEventsScreen } from '../screens/coach/EventsScreen';
import { CoachEventDetailsScreen } from '../screens/coach/EventDetailsScreen';
import { CoachAnnouncementsScreen } from '../screens/coach/AnnouncementsScreen';
import { CoachChatScreen } from '../screens/coach/ChatScreen';

// Parent Screens
import { ParentDashboardScreen } from '../screens/parent/DashboardScreen';
import { ChildrenScreen } from '../screens/parent/ChildrenScreen';
import { ChildDetailsScreen } from '../screens/parent/ChildDetailsScreen';
import { TeamInfoScreen } from '../screens/parent/TeamInfoScreen';
import { ParentPaymentsScreen } from '../screens/parent/PaymentsScreen';
import { ParentEventsScreen } from '../screens/parent/EventsScreen';
import { ParentEventDetailsScreen } from '../screens/parent/EventDetailsScreen';
import { ParentAnnouncementsScreen } from '../screens/parent/AnnouncementsScreen';
import { ParentChatScreen } from '../screens/parent/ChatScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const AdminTab = createBottomTabNavigator<AdminTabParamList>();
const CoachTab = createBottomTabNavigator<CoachTabParamList>();
const ParentTab = createBottomTabNavigator<ParentTabParamList>();

const AdminTabNavigator = () => (
  <AdminTab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap = 'alert';
        switch (route.name) {
          case 'Dashboard':
            iconName = focused ? 'home' : 'home-outline';
            break;
          case 'Teams':
            iconName = focused ? 'people' : 'people-outline';
            break;
          case 'Players':
            iconName = focused ? 'person' : 'person-outline';
            break;
          case 'Payments':
            iconName = focused ? 'card' : 'card-outline';
            break;
          case 'Events':
            iconName = focused ? 'calendar' : 'calendar-outline';
            break;
          case 'Announcements':
            iconName = focused ? 'megaphone' : 'megaphone-outline';
            break;
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <AdminTab.Screen name="Dashboard" component={DashboardScreen} />
    <AdminTab.Screen name="Teams" component={TeamsScreen} />
    <AdminTab.Screen name="Players" component={PlayersScreen} />
    <AdminTab.Screen name="Payments" component={PaymentsScreen} />
    <AdminTab.Screen name="Events" component={EventsScreen} />
    <AdminTab.Screen name="Announcements" component={AnnouncementsScreen} />
  </AdminTab.Navigator>
);

const CoachTabNavigator = () => (
  <CoachTab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap = 'alert';
        switch (route.name) {
          case 'Dashboard':
            iconName = focused ? 'home' : 'home-outline';
            break;
          case 'Teams':
            iconName = focused ? 'people' : 'people-outline';
            break;
          case 'Players':
            iconName = focused ? 'person' : 'person-outline';
            break;
          case 'Events':
            iconName = focused ? 'calendar' : 'calendar-outline';
            break;
          case 'Announcements':
            iconName = focused ? 'megaphone' : 'megaphone-outline';
            break;
          case 'Chat':
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            break;
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <CoachTab.Screen name="Dashboard" component={CoachDashboardScreen} />
    <CoachTab.Screen name="Teams" component={CoachTeamsScreen} />
    <CoachTab.Screen name="Players" component={CoachPlayersScreen} />
    <CoachTab.Screen name="Events" component={CoachEventsScreen} />
    <CoachTab.Screen name="Announcements" component={CoachAnnouncementsScreen} />
    <CoachTab.Screen name="Chat" component={CoachChatScreen} />
  </CoachTab.Navigator>
);

const ParentTabNavigator = () => (
  <ParentTab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap = 'alert';
        switch (route.name) {
          case 'Dashboard':
            iconName = focused ? 'home' : 'home-outline';
            break;
          case 'Children':
            iconName = focused ? 'people' : 'people-outline';
            break;
          case 'Payments':
            iconName = focused ? 'card' : 'card-outline';
            break;
          case 'Events':
            iconName = focused ? 'calendar' : 'calendar-outline';
            break;
          case 'Announcements':
            iconName = focused ? 'megaphone' : 'megaphone-outline';
            break;
          case 'Chat':
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            break;
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <ParentTab.Screen name="Dashboard" component={ParentDashboardScreen} />
    <ParentTab.Screen name="Children" component={ChildrenScreen} />
    <ParentTab.Screen name="Payments" component={ParentPaymentsScreen} />
    <ParentTab.Screen name="Events" component={ParentEventsScreen} />
    <ParentTab.Screen name="Announcements" component={ParentAnnouncementsScreen} />
    <ParentTab.Screen name="Chat" component={ParentChatScreen} />
  </ParentTab.Navigator>
);

export const Navigation = () => {
  const { user } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        // Auth Stack
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="CoachLogin" component={CoachLoginScreen} />
          <Stack.Screen name="ParentPhoneEntry" component={ParentPhoneEntryScreen} />
          <Stack.Screen name="ParentTeamCode" component={ParentTeamCodeScreen} />
          <Stack.Screen name="ParentSetup" component={ParentSetupScreen} />
          <Stack.Screen name="ParentPassword" component={ParentPasswordScreen} />
        </>
      ) : (
        // Role-based Stack
        <>
          {user.role === 'admin' && (
            <>
              <Stack.Screen name="AdminTabs" component={AdminTabNavigator} />
              <Stack.Screen 
                name="Settings" 
                component={SettingsScreen}
                options={{
                  headerShown: true,
                  title: 'Profile Settings',
                  headerBackTitle: 'Back'
                }}
              />
              <Stack.Screen
                name="ClubInformation"
                component={ClubInformationScreen}
                options={{
                  headerShown: true,
                  title: 'Club Information',
                  headerBackTitle: 'Back'
                }}
              />
              <Stack.Screen
                name="AdminProfile"
                component={AdminProfileScreen}
                options={{
                  headerShown: true,
                  title: 'Admin Profile',
                  headerBackTitle: 'Back'
                }}
              />
              <Stack.Screen
                name="Security"
                component={SecurityScreen}
                options={{
                  headerShown: true,
                  title: 'Security',
                  headerBackTitle: 'Back'
                }}
              />
              <Stack.Screen
                name="ProfileInformation"
                component={ProfileInformationScreen}
                options={{
                  headerShown: true,
                  title: 'Edit Profile',
                  headerBackTitle: 'Back'
                }}
              />
            </>
          )}
          {user.role === 'coach' && (
            <Stack.Screen name="CoachTabs" component={CoachTabNavigator} />
          )}
          {user.role === 'parent' && (
            <Stack.Screen name="ParentTabs" component={ParentTabNavigator} />
          )}
        </>
      )}
    </Stack.Navigator>
  );
}; 