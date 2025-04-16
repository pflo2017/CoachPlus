import { NavigatorScreenParams } from '@react-navigation/native';
import { UserRole } from '../types';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<AdminTabParamList | CoachTabParamList | ParentTabParamList>;
};

export type AuthStackParamList = {
  Welcome: undefined;
  Login: { role: UserRole };
  Register: { role: UserRole };
};

export type AdminTabParamList = {
  Dashboard: undefined;
  Teams: undefined;
  Players: undefined;
  Coaches: undefined;
  Schedule: undefined;
  Payments: undefined;
  Chat: undefined;
  Profile: undefined;
  CreatePost: undefined;
  PaymentStatus: undefined;
  SearchPlayer: undefined;
  Announcements: undefined;
  TeamDetails: { teamId: string };
};

export type CoachTabParamList = {
  // Add coach tab screens here
};

export type ParentTabParamList = {
  // Add parent tab screens here
}; 