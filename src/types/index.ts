export type UserRole = 'admin' | 'coach' | 'parent';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  profile_picture_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Club {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  admin_id: string;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  club_id: string;
  coach_id: string;
  access_code: string;
  created_at: string;
  updated_at: string;
}

export interface Player {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  team_id: string;
  parent_id: string;
  profile_picture_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Parent {
  id: string;
  name: string;
  phone: string;
  children: Player[];
}

export interface Coach {
  id: string;
  name: string;
  phone: string;
  accessCode: string;
  teams: Team[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  team_id: string;
  created_at: string;
  updated_at: string;
}

export interface EventResponse {
  id: string;
  event_id: string;
  player_id: string;
  response: 'yes' | 'no' | 'maybe';
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  team_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  player_id: string;
  parent_id: string;
  team_id: string;
  created_at: string;
  updated_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

// Navigation Params
export type RootStackParamList = {
  Welcome: undefined;
  Login: { role: UserRole };
  Register: { role: UserRole };
  CoachLogin: undefined;
  ParentPhoneEntry: undefined;
  ParentTeamCode: { phone: string };
  ParentSetup: { phone: string; teamCode: string };
  ParentPassword: { phone: string; teamCode: string };
  AdminTabs: undefined;
  CoachTabs: undefined;
  ParentTabs: undefined;
  Settings: undefined;
};

export type AdminTabParamList = {
  Dashboard: undefined;
  Teams: undefined;
  TeamDetails: { teamId: string };
  Players: undefined;
  PlayerDetails: { playerId: string };
  Payments: undefined;
  Events: undefined;
  EventDetails: { eventId: string };
  Announcements: undefined;
};

export type CoachTabParamList = {
  Dashboard: undefined;
  Teams: undefined;
  TeamDetails: { teamId: string };
  Players: undefined;
  PlayerDetails: { playerId: string };
  Events: undefined;
  EventDetails: { eventId: string };
  Announcements: undefined;
  Chat: undefined;
};

export type ParentTabParamList = {
  Dashboard: undefined;
  Children: undefined;
  ChildDetails: { childId: string };
  TeamInfo: { teamId: string };
  Payments: undefined;
  Events: undefined;
  EventDetails: { eventId: string };
  Announcements: undefined;
  Chat: undefined;
}; 