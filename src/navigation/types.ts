import { NavigatorScreenParams } from '@react-navigation/native';
import { UserRole } from '../types';

export type RootStackParamList = {
  Welcome: undefined;
  Login: { role: UserRole };
  Register: { role: UserRole };
  CoachLogin: undefined;
  ParentPhoneEntry: undefined;
  ParentTeamCode: { phone: string; isNewUser: boolean };
  ParentSetup: { phone: string; teamCode: string };
  ParentPassword: { phone: string };
  AdminTabs: undefined;
  CoachTabs: undefined;
  ParentTabs: undefined;
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
  Settings: undefined;
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