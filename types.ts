
export enum RequestCategory {
  EMERGENCY = 'Emergency',
  MEDICINE = 'Medicine',
  TOOLS = 'Tools',
  GROCERY = 'Grocery',
  SENIOR_CARE = 'Senior Care',
  GENERAL = 'General'
}

export enum RequestStatus {
  OPEN = 'Open',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved'
}

export interface UserLocation {
  lat: number;
  lng: number;
}

export interface HelpRequest {
  id: string;
  userId: string;
  userName: string;
  phone: string;
  title: string;
  description: string;
  category: RequestCategory;
  timestamp: number;
  location: UserLocation;
  status: RequestStatus;
  priority?: 'High' | 'Medium' | 'Low';
  distance?: number;
  offeredByMe?: boolean;
  isLocationVisible?: boolean;
  helperId?: string; // Tracks who is helping
  helperName?: string;
  tokensGifted?: boolean; // Prevents multiple gifting
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  isMe: boolean;
}

export interface Conversation {
  id: string;
  requestId: string;
  requestTitle: string;
  participantName: string;
  participantPhone?: string; // Added to store shared phone
  participantLocation?: UserLocation; // Added to store shared location
  participantInitials: string;
  messages: Message[];
  lastMessageAt: number;
  unreadCount: number;
}

export type NotificationType = 'NEW_REQUEST' | 'OFFER_RECEIVED' | 'MESSAGE_RECEIVED' | 'TOKEN_RECEIVED';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  relatedId?: string; // requestId or conversationId
}

export interface AIProcessedRequest {
  category: RequestCategory;
  priority: 'High' | 'Medium' | 'Low';
  tags: string[];
}
