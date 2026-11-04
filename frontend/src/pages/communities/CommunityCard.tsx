import React from 'react';
import { Link } from 'react-router-dom';
import { Users, MessageSquare, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import type { Community } from '@/types';

interface CommunityCardProps {
  community: Community;
  onJoinToggle?: (communityId: string) => void;
}

export const CommunityCard: React.FC<CommunityCardProps> = ({
  community,
  onJoinToggle,
}) => {
  const language = typeof community.language === 'string' ? community.language : (community.language as any)?.name;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between">
      <div>
        {/* Banner */}
        <div className="h-32 w-full bg-indigo-900 relative overflow-hidden">
          {community.bannerImage || community.imageUrl ? (
            <img
              src={community.bannerImage || community.imageUrl}
              alt={community.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-indigo-700 to-blue-600" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
            <Badge variant="primary" size="sm" className="bg-white/20 backdrop-blur-xs text-white border-0 text-[11px]">
              {language} {community.languageNative ? `• ${community.languageNative}` : ''}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <Link to={`/communities/${community.id}`} className="group block">
            <h3 className="font-bold text-gray-900 text-base group-hover:text-indigo-600 transition-colors leading-snug">
              {community.name}
            </h3>
          </Link>
          <p className="mt-2 text-xs text-gray-600 line-clamp-2 leading-relaxed">
            {community.description}
          </p>

          <div className="mt-4 flex items-center space-x-4 text-xs text-gray-500 font-medium">
            <span className="flex items-center">
              <Users className="w-3.5 h-3.5 mr-1 text-indigo-500" />
              {community.memberCount} members
            </span>
            <span className="flex items-center">
              <MessageSquare className="w-3.5 h-3.5 mr-1 text-blue-500" />
              {community.postCount || 0} posts
            </span>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="p-4 pt-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <Link
          to={`/communities/${community.id}`}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center"
        >
          View Circle
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Link>
        {onJoinToggle && (
          <Button
            size="sm"
            variant={community.isMember ? 'outline' : 'primary'}
            onClick={() => onJoinToggle(community.id)}
            className={`text-xs py-1 px-3 ${
              community.isMember ? 'text-gray-600 border-gray-300' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {community.isMember ? 'Joined ✓' : 'Join'}
          </Button>
        )}
      </div>
    </div>
  );
};
