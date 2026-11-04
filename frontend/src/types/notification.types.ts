export type NotificationType =
  | 'connection_request'
  | 'connection_accepted'
  | 'connection_rejected'
  | 'new_message'
  | 'post_like'
  | 'post_comment'
  | 'comment_like'
  | 'community_invite'
  | 'system';

export interface NotificationActor {
  id: string;
  fullName: string;
  avatar: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  actorId?: string;
  actor?: NotificationActor;
  title: string;
  message: string;
  content?: string;
  preview?: string;
  data?: {
    connectionRequestId?: string;
    conversationId?: string;
    postId?: string;
    commentId?: string;
    communityId?: string;
    [key: string]: unknown;
  };
  read: boolean;
  isRead?: boolean;
  actionUrl?: string;
  timestamp: string;
  createdAt: string;
}

export interface NotificationSettings {
  connectionRequests: boolean;
  connectionAccepted: boolean;
  newMessages: boolean;
  postLikes: boolean;
  postComments: boolean;
  communityInvites: boolean;
  systemUpdates: boolean;
  emailDigest: boolean;
  emailWeeklySummary: boolean;
  emailConnectionRequests: boolean;
  emailImportantUpdates: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
}
