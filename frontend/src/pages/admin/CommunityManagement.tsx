import React, { useState } from 'react';
import { Users, Plus, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import initialCommunities from '@/data/communities.json';
import { LANGUAGES } from '@/data/constants';
import type { Community } from '@/types';

export const CommunityManagement: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>(initialCommunities as any[]);
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState(LANGUAGES[0]);

  const handleAddCommunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newComm: Community = {
      id: `comm-${Date.now()}`,
      name,
      description,
      language,
      city: 'Gurugram',
      state: 'Haryana',
      memberCount: 1,
      postCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCommunities([newComm, ...communities]);
    setName('');
    setDescription('');
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this community?')) {
      setCommunities((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900">Language Circles & Community Moderation</h3>
          <p className="text-xs text-gray-500">Create, configure, and maintain community spaces.</p>
        </div>
        <Button
          size="sm"
          onClick={() => setIsAdding(!isAdding)}
          className="bg-indigo-600 hover:bg-indigo-700 text-xs"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          {isAdding ? 'Cancel' : 'New Circle'}
        </Button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddCommunity} className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-3">
          <h4 className="font-bold text-xs text-indigo-900">Add New Language Community</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Gurugram Kannada Balaga"
              className="text-xs border border-gray-200 rounded-lg p-2 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="text-xs border border-gray-200 rounded-lg p-2 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief community description..."
            className="w-full text-xs border border-gray-200 rounded-lg p-2 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-xs">
            Save Community
          </Button>
        </form>
      )}

      <div className="divide-y divide-gray-100">
        {communities.map((comm) => (
          <div key={comm.id} className="py-3 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xs text-gray-900">{comm.name}</span>
                <Badge variant="primary" size="sm" className="text-[10px]">
                  {typeof comm.language === 'string' ? comm.language : (comm.language as any)?.name}
                </Badge>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5">{comm.description}</p>
              <span className="text-[10px] text-gray-400 mt-1 block">
                {comm.memberCount} members • {comm.postCount || 0} posts
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleDelete(comm.id)}
              className="text-gray-400 hover:text-red-600 p-1 rounded-lg"
              title="Delete Community"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

