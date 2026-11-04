import type { MotherTongue } from './user.types';

export interface Community {
  id: string;
  name: string;
  description: string;
  language: MotherTongue | string;
  languageNative?: string;
  languageId?: string;
  city?: string;
  state?: string;
  locationCountry?: string;
  locationCity?: string;
  bannerImage?: string;
  imageUrl?: string;
  languageIcon?: string;
  memberCount: number;
  postCount?: number;
  lastActivityDate?: string;
  createdAt: string;
  updatedAt: string;
  isMember?: boolean;
  joinedDate?: string;
  moderators?: string[];
  createdBy?: string;
}

export interface PostAuthor {
  id: string;
  fullName: string;
  avatar: string;
  motherTongue?: string;
  hometown?: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: PostAuthor;
  content: string;
  likeCount?: number;
  isLikedByCurrentUser?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Post {
  id: string;
  communityId: string;
  communityName?: string;
  community?: Pick<Community, 'id' | 'name' | 'language'>;
  authorId: string;
  author: PostAuthor;
  content: string;
  imageUrl?: string;
  likeCount: number;
  likes?: number;
  commentCount: number;
  comments?: Comment[];
  isLikedByCurrentUser?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreatePostRequest {
  communityId: string;
  content: string;
  imageUrl?: string;
}

export interface CreateCommentRequest {
  postId: string;
  content: string;
}

export interface CommunityMember {
  id: string;
  communityId: string;
  userId: string;
  user: PostAuthor & {
    profession?: string;
    approximateDistance?: string;
    sharedInterests?: string[];
    connectionStatus?: 'not-connected' | 'pending-sent' | 'pending-received' | 'connected';
  };
  joinedDate: string;
  role: 'member' | 'moderator' | 'admin';
}

export interface CommunityStats {
  totalMembers: number;
  activeMembersThisWeek: number;
  totalPosts: number;
  postsThisWeek: number;
  totalComments: number;
}
