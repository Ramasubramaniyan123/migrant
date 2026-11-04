import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, MessageSquare, Plus, ArrowLeft, ShieldCheck, MapPin } from 'lucide-react';
import { CommunityFeed } from './CommunityFeed';
import { CreatePostModal } from './CreatePostModal';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { UserCard } from '@/components/shared/UserCard';
import { useUserContext } from '@/context/UserContext';
import { useAuth } from '@/hooks/useAuth';
import communitiesData from '@/data/communities.json';
import initialPosts from '@/data/posts.json';
import type { Community, Post, CreatePostRequest } from '@/types';

export const CommunityDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { users } = useUserContext();

  const [community, setCommunity] = useState<Community | undefined>(() =>
    (communitiesData as any[]).find((c) => c.id === id) || (communitiesData as any[])[0]
  );

  const [posts, setPosts] = useState<Post[]>(() =>
    (initialPosts as any[]).filter((p) => p.communityId === (id || 'comm-tamil'))
  );

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'members'>('posts');

  if (!community) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900">Community Not Found</h2>
        <Link to="/communities" className="text-indigo-600 hover:underline mt-2 inline-block">
          ← Back to Communities
        </Link>
      </div>
    );
  }

  const handleJoinToggle = () => {
    setCommunity((prev) => {
      if (!prev) return prev;
      const isMember = !prev.isMember;
      return {
        ...prev,
        isMember,
        memberCount: isMember ? prev.memberCount + 1 : prev.memberCount - 1,
      };
    });
  };

  const handleCreatePost = (req: CreatePostRequest) => {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      communityId: community.id,
      communityName: community.name,
      authorId: user?.id || 'user-demo',
      author: {
        id: user?.id || 'user-demo',
        fullName: user?.fullName || 'Arun Selvam',
        avatar: user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arun',
        motherTongue: typeof user?.motherTongue === 'string' ? user.motherTongue : 'Tamil',
        hometown: user?.hometown ? `${user.hometown.city}, ${user.hometown.state}` : 'Hometown',
      },
      content: req.content,
      imageUrl: req.imageUrl,
      likeCount: 0,
      likes: 0,
      commentCount: 0,
      comments: [],
      isLikedByCurrentUser: false,
      createdAt: new Date().toISOString(),
    };
    setPosts([newPost, ...posts]);
  };

  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = p.isLikedByCurrentUser;
          return {
            ...p,
            isLikedByCurrentUser: !isLiked,
            likeCount: isLiked ? p.likeCount - 1 : p.likeCount + 1,
            likes: isLiked ? (p.likes || 1) - 1 : (p.likes || 0) + 1,
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string, content: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newComment = {
            id: `c-${Date.now()}`,
            postId,
            authorId: user?.id || 'user-demo',
            author: {
              id: user?.id || 'user-demo',
              fullName: user?.fullName || 'Arun Selvam',
              avatar: user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arun',
            },
            content,
            likeCount: 0,
            createdAt: new Date().toISOString(),
          };
          const updatedComments = [...(p.comments || []), newComment];
          return {
            ...p,
            comments: updatedComments,
            commentCount: updatedComments.length,
          };
        }
        return p;
      })
    );
  };

  // Simulated members from users context
  const members = users.slice(0, 6);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Back button */}
      <Link
        to="/communities"
        className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1" />
        Back to Communities
      </Link>

      {/* Banner & Header */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="h-48 sm:h-64 w-full bg-slate-900 relative">
          {community.bannerImage && (
            <img
              src={community.bannerImage}
              alt={community.name}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="primary" size="sm" className="bg-white/20 backdrop-blur-xs text-white border-0">
                  {typeof community.language === 'string' ? community.language : (community.language as any)?.name}
                </Badge>
                {community.languageNative && (
                  <span className="text-xs text-white/80 font-medium">({community.languageNative})</span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{community.name}</h1>
              <div className="flex items-center space-x-4 text-xs text-white/80 mt-2 font-medium">
                <span className="flex items-center">
                  <Users className="w-3.5 h-3.5 mr-1" />
                  {community.memberCount} Members
                </span>
                <span className="flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1" />
                  {community.city || 'Gurugram'}, {community.state || 'Haryana'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant={community.isMember ? 'outline' : 'primary'}
                onClick={handleJoinToggle}
                className={community.isMember ? 'bg-white/10 text-white border-white/40 hover:bg-white/20' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'}
              >
                {community.isMember ? 'Joined Member ✓' : 'Join Circle'}
              </Button>
              <Button
                variant="primary"
                onClick={() => setIsPostModalOpen(true)}
                className="bg-white text-indigo-700 hover:bg-indigo-50 font-semibold"
              >
                <Plus className="w-4 h-4 mr-1" />
                Post
              </Button>
            </div>
          </div>
        </div>

        {/* Community About & Tabs */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="text-sm text-gray-600 max-w-3xl leading-relaxed">
            {community.description}
          </p>
          <div className="flex rounded-lg bg-gray-100 p-1 border border-gray-200 self-start">
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'posts' ? 'bg-white text-indigo-700 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Feed Posts ({posts.length})
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'members' ? 'bg-white text-indigo-700 shadow-xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Members ({members.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'posts' ? (
        <CommunityFeed
          posts={posts}
          onLikePost={handleLikePost}
          onAddComment={handleAddComment}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((m) => (
            <UserCard key={m.id} user={m} />
          ))}
        </div>
      )}

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onSubmit={handleCreatePost}
        defaultCommunityId={community.id}
      />
    </div>
  );
};

