export type RootStackParamList = {
  MainTabs: undefined;
  RequestDetails: { id: string };
  CreateRequest: undefined;
  Login: undefined;
  Profile: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  MyRequests: undefined;
  Notifications: undefined;
  Settings: undefined;
};
export type IssueStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'DUPLICATE';
export type IssueCategory = 'INFRASTRUCTURE' | 'SAFETY' | 'UTILITIES' | 'CLEANUP' | 'OTHER';

export interface User {
  id: string;
  name: string;
  role: 'CITIZEN' | 'COMMUNITY_LEADER' | 'ADMIN';
}

export interface CommunityIssue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  latitude: number;
  longitude: number;
  reportedBy: string; // User ID
  upvotes: number;
  votedUserIds: string[]; // Prevents double-voting
  createdAt: Date;
  updatedAt: Date;
}
