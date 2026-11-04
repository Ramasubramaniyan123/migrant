import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Compass,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Send,
  Heart,
  MessageCircle,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useUserContext } from '@/context/UserContext';
import { useConnectionContext } from '@/context/ConnectionContext';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { ROUTES } from '@/utils/constants';
import communitiesData from '@/data/communities.json';
import initialPosts from '@/data/posts.json';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { users } = useUserContext();
  const { connections, pendingRequests, sendRequest } = useConnectionContext();

  const [posts, setPosts] = useState(initialPosts);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState('comm-tamil');

  // Hometown matches
  const hometownMatches = users.filter((u) => {
    if (u.id === user?.id) return false;
    const sameCity = u.hometown?.city && user?.hometown?.city && u.hometown.city.toLowerCase() === user.hometown.city.toLowerCase();
    const sameState = u.hometown?.state && user?.hometown?.state && u.hometown.state.toLowerCase() === user.hometown.state.toLowerCase();
    return sameCity || sameState;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const comm = (communitiesData as any[]).find((c) => c.id === selectedCommunity);
    const newPost = {
      id: `post-${Date.now()}`,
      communityId: selectedCommunity,
      communityName: comm?.name || 'Community',
      authorId: user?.id || 'user-demo',
      author: {
        id: user?.id || 'user-demo',
        fullName: user?.fullName || 'Arun Selvam',
        avatar: user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arun',
        motherTongue: typeof user?.motherTongue === 'string' ? user.motherTongue : 'Tamil',
        hometown: user?.hometown ? `${user.hometown.city}, ${user.hometown.state}` : 'Tenkasi, Tamil Nadu',
      },
      content: newPostContent,
      likeCount: 0,
      likes: 0,
      commentCount: 0,
      comments: [],
      isLikedByCurrentUser: false,
      createdAt: new Date().toISOString(),
    };

    setPosts([newPost as any, ...posts]);
    setNewPostContent('');
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

  const displayName = user?.fullName || user?.firstName || 'Member';
  const hometownCity = user?.hometown?.city || 'Hometown';
  const hometownState = user?.hometown?.state || 'State';
  const motherTongue = typeof user?.motherTongue === 'string' ? user.motherTongue : (user?.motherTongue as any)?.name || 'Tamil';

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="primary" size="sm" className="bg-white/20 text-white border-0 backdrop-blur-xs">
              📍 Based in {user?.currentLocation?.locality || 'Cyber City'}, Gurugram
            </Badge>
            <Badge variant="primary" size="sm" className="bg-white/20 text-white border-0 backdrop-blur-xs">
              🗣 Native {motherTongue}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Vanakkam, {displayName}!
          </h1>
          <p className="mt-2 text-indigo-100 text-sm sm:text-base leading-relaxed">
            There are <strong className="text-white font-semibold">{hometownMatches.length} people</strong> from {hometownState} living in Gurugram within 5km of you.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to={ROUTES.HOMETOWN}>
              <Button size="sm" className="bg-white text-indigo-700 hover:bg-indigo-50 font-semibold shadow-xs">
                View {hometownCity} Matches
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
            <Link to={ROUTES.DISCOVER}>
              <Button variant="outline" size="sm" className="border-white/40 text-white hover:bg-white/10">
                Explore Proximity Map
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to={ROUTES.CONNECTIONS}
          className="bg-white rounded-xl p-5 border border-gray-200 hover:border-indigo-300 shadow-xs hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Connections</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">{connections.length}</p>
          <span className="text-[11px] text-indigo-600 font-medium">
            {pendingRequests > 0 ? `${pendingRequests} requests waiting` : 'All connected'}
          </span>
        </Link>

        <Link
          to={ROUTES.HOMETOWN}
          className="bg-white rounded-xl p-5 border border-gray-200 hover:border-indigo-300 shadow-xs hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Hometown Matches</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">{hometownMatches.length}</p>
          <span className="text-[11px] text-amber-600 font-medium">From {hometownState}</span>
        </Link>

        <Link
          to={ROUTES.COMMUNITIES}
          className="bg-white rounded-xl p-5 border border-gray-200 hover:border-indigo-300 shadow-xs hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Active Communities</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">{communitiesData.length}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Language circles</span>
        </Link>

        <Link
          to={ROUTES.MESSAGES}
          className="bg-white rounded-xl p-5 border border-gray-200 hover:border-indigo-300 shadow-xs hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Active Chats</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">2</p>
          <span className="text-[11px] text-blue-600 font-medium">1 unread message</span>
        </Link>
      </div>

      {/* Main 2-column feed and sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Post Creation Box */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-gray-900">Post to Community</span>
              <select
                value={selectedCommunity}
                onChange={(e) => setSelectedCommunity(e.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-2.5 py-1 text-gray-700 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {communitiesData.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <form onSubmit={handleCreatePost}>
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows={2}
                placeholder="Share a recommendation, ask for housing help, or organize a meetup..."
                className="w-full text-sm border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
              <div className="mt-2.5 flex items-center justify-between">
                <span className="text-xs text-gray-400">Be respectful and friendly</span>
                <Button
                  type="submit"
                  size="sm"
                  disabled={!newPostContent.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  Post
                </Button>
              </div>
            </form>
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Community Updates</h2>
            {posts.map((post: any) => (
              <div key={post.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={post.author?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'}
                      alt={post.author?.fullName}
                      className="w-10 h-10 rounded-full bg-gray-100 object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">{post.author?.fullName}</h4>
                      <p className="text-xs text-gray-500">
                        {post.author?.hometown || post.communityName || 'Community Member'}
                      </p>
                    </div>
                  </div>
                  {post.communityName && (
                    <Badge variant="secondary" size="sm" className="text-xs">
                      {post.communityName}
                    </Badge>
                  )}
                </div>

                <p className="mt-3 text-sm text-gray-800 leading-relaxed">{post.content}</p>

                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt="Post attachment"
                    className="mt-3 rounded-lg w-full max-h-72 object-cover"
                  />
                )}

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <button
                    onClick={() => handleLikePost(post.id)}
                    className={`flex items-center space-x-1.5 transition-colors ${
                      post.isLikedByCurrentUser ? 'text-rose-600 font-semibold' : 'hover:text-gray-900'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.isLikedByCurrentUser ? 'fill-rose-600' : ''}`} />
                    <span>{post.likes || post.likeCount || 0} Likes</span>
                  </button>

                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments?.length || post.commentCount || 0} Comments</span>
                  </div>
                </div>

                {/* Inline comments if any */}
                {post.comments && post.comments.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-50 space-y-2">
                    {post.comments.map((comment: any) => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-2.5 text-xs text-gray-700">
                        <span className="font-semibold text-gray-900 mr-2">{comment.author?.fullName}:</span>
                        <span>{comment.content}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Recommendations & Hometown side widget */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-sm">Nearby Hometown Matches</h3>
              <Link to={ROUTES.HOMETOWN} className="text-xs text-indigo-600 hover:underline font-medium">
                See all
              </Link>
            </div>
            <div className="space-y-3">
              {hometownMatches.slice(0, 3).map((match) => (
                <div key={match.id} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3 min-w-0">
                    <img src={match.avatar} alt={match.fullName} className="w-9 h-9 rounded-full bg-gray-100" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate">{match.fullName}</p>
                      <p className="text-[11px] text-gray-500 truncate">
                        {match.hometown?.city}, {match.hometown?.state}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => sendRequest(match.id)}
                    className="text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    Connect
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Communities Preview widget */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-sm">Language Communities</h3>
              <Link to={ROUTES.COMMUNITIES} className="text-xs text-indigo-600 hover:underline font-medium">
                Explore
              </Link>
            </div>
            <div className="space-y-3">
              {communitiesData.slice(0, 3).map((comm) => (
                <Link
                  key={comm.id}
                  to={`/communities/${comm.id}`}
                  className="block p-3 rounded-xl border border-gray-100 hover:border-indigo-200 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-gray-900">{comm.name}</span>
                    <Badge variant="primary" size="sm" className="text-[10px]">
                      {comm.language}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1 line-clamp-1">{comm.description}</p>
                  <p className="text-[10px] text-gray-400 mt-1.5">{comm.memberCount} members</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
