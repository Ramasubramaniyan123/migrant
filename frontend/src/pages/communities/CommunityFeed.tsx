import React, { useState } from 'react';
import { Heart, MessageCircle, Send, Share2 } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import type { Post } from '@/types';
import { useAuth } from '@/hooks/useAuth';

interface CommunityFeedProps {
  posts: Post[];
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, content: string) => void;
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({
  posts,
  onLikePost,
  onAddComment,
}) => {
  const { user } = useAuth();
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const commentText = commentInputs[postId]?.trim();
    if (!commentText) return;

    onAddComment(postId, commentText);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">
        <p className="text-sm">No posts yet in this community. Be the first to start a conversation!</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {posts.map((post) => {
        const isLiked = post.isLikedByCurrentUser;
        const currentLikes = post.likes !== undefined ? post.likes : post.likeCount;
        const commentsList = post.comments || [];

        return (
          <div
            key={post.id}
            className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:border-gray-300 transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={post.author?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=user'}
                  alt={post.author?.fullName}
                  className="w-10 h-10 rounded-full bg-gray-100 object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{post.author?.fullName}</h4>
                  <p className="text-[11px] text-gray-500">
                    {post.author?.hometown || 'Member'} • {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {post.communityName && (
                <Badge variant="secondary" size="sm" className="text-[10px]">
                  {post.communityName}
                </Badge>
              )}
            </div>

            {/* Post Content */}
            <p className="mt-3 text-sm text-gray-800 leading-relaxed whitespace-pre-line">
              {post.content}
            </p>

            {/* Image attachment */}
            {post.imageUrl && (
              <div className="mt-3 rounded-xl overflow-hidden max-h-80 border border-gray-100">
                <img
                  src={post.imageUrl}
                  alt="Post Attachment"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Reaction Bar */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => onLikePost(post.id)}
                  className={`flex items-center space-x-1.5 transition-colors ${
                    isLiked ? 'text-rose-600 font-semibold' : 'hover:text-gray-900'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600' : ''}`} />
                  <span>{currentLikes} Likes</span>
                </button>

                <div className="flex items-center space-x-1.5">
                  <MessageCircle className="w-4 h-4" />
                  <span>{commentsList.length} Comments</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText?.(window.location.href);
                  alert('Post link copied to clipboard!');
                }}
                className="hover:text-gray-900 flex items-center space-x-1"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>

            {/* Comments List */}
            {commentsList.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-100 space-y-2.5">
                {commentsList.map((c) => (
                  <div key={c.id} className="bg-gray-50 rounded-xl p-3 text-xs flex items-start space-x-2.5">
                    <img
                      src={c.author?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=c'}
                      alt=""
                      className="w-6 h-6 rounded-full bg-gray-200 mt-0.5 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">{c.author?.fullName}</span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-gray-700 mt-0.5">{c.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Comment input form */}
            <form
              onSubmit={(e) => handleCommentSubmit(post.id, e)}
              className="mt-3 flex items-center space-x-2"
            >
              <input
                type="text"
                value={commentInputs[post.id] || ''}
                onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                placeholder="Write a comment..."
                className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 bg-gray-50/50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <Button
                type="submit"
                size="sm"
                disabled={!commentInputs[post.id]?.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 py-1.5 px-3 text-xs"
              >
                <Send className="w-3 h-3" />
              </Button>
            </form>
          </div>
        );
      })}
    </div>
  );
};
