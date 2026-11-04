import React, { useState } from 'react';
import { CommunityCard } from './CommunityCard';
import { CreatePostModal } from './CreatePostModal';
import { Button } from '@/components/common/Button';
import { Plus, Search, Filter } from 'lucide-react';
import communitiesData from '@/data/communities.json';
import { LANGUAGES } from '@/data/constants';
import type { Community } from '@/types';

export const CommunitiesPage: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>(communitiesData as any[]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const handleJoinToggle = (communityId: string) => {
    setCommunities((prev) =>
      prev.map((c) => {
        if (c.id === communityId) {
          const isMember = !c.isMember;
          return {
            ...c,
            isMember,
            memberCount: isMember ? c.memberCount + 1 : c.memberCount - 1,
          };
        }
        return c;
      })
    );
  };

  const filteredCommunities = communities.filter((c) => {
    if (selectedLanguage !== 'All') {
      const lang = typeof c.language === 'string' ? c.language : (c.language as any)?.name;
      if (lang !== selectedLanguage) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchDesc = c.description.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Language Communities & Cultural Circles
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Join groups based on your mother tongue, local events, festivals, and food cravings in NCR.
          </p>
        </div>

        <Button
          onClick={() => setIsPostModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Create Post
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search communities by language, festival, or keyword..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Language Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedLanguage('All')}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap ${
              selectedLanguage === 'All'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Communities ({communities.length})
          </button>
          {LANGUAGES.slice(0, 8).map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang)}
              className={`px-3 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap ${
                selectedLanguage === lang
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of communities */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCommunities.map((community) => (
          <CommunityCard
            key={community.id}
            community={community}
            onJoinToggle={handleJoinToggle}
          />
        ))}
      </div>

      <CreatePostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onSubmit={(req) => {
          alert(`Post submitted to community!`);
        }}
      />
    </div>
  );
};

