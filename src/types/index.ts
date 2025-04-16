export type UserRole = 'admin' | 'coach' | 'parent';

export interface User {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  role: UserRole;
  profilePicture?: string;
}

export interface Club {
  id: string;
  name: string;
  location: string;
  logo?: string;
  adminId: string;
}

export interface Team {
  id: string;
  name: string;
  access_code: string;
  club_id: string;
  coach_id?: string;
  coaches?: {
    name: string;
    phone: string;
  };
  players?: {
    count: number;
  }[];
}

export interface Player {
  id: string;
  name: string;
  birthDate: string;
  profilePicture?: string;
  medicalVisa: boolean;
  teamId: string;
  parentId: string;
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
  type: 'training' | 'match' | 'tournament' | 'other';
  date: string;
  time: string;
  location: string;
  teamId: string;
  recurring?: boolean;
  additionalInfo?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  teamId: string;
  authorId: string;
  createdAt: string;
  isPinned: boolean;
}

export interface Payment {
  id: string;
  playerId: string;
  month: string;
  year: string;
  status: 'paid' | 'pending' | 'overdue';
  amount: number;
} 