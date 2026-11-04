import React, { useState } from 'react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Image, Send } from 'lucide-react';
import communitiesData from '@/data/communities.json';
import type { CreatePostRequest } from '@/types';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: CreatePostRequest) => void;
  defaultCommunityId?: string;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultCommunityId = 'comm-tamil',
}) => {
  const [communityId, setCommunityId] = useState(defaultCommunityId);
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    onSubmit({
      communityId,
      content,
      imageUrl: imageUrl.trim() || undefined,
    });

    setContent('');
    setImageUrl('');
    setShowImageInput(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Community Post" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Target Community</label>
          <select
            value={communityId}
            onChange={(e) => setCommunityId(e.target.value)}
            className="w-full text-xs border border-gray-200 rounded-lg p-2.5 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {communitiesData.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.language})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Your Post</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder="Write what's on your mind, questions about the locality, or meetup ideas..."
            className="w-full text-sm border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {showImageInput ? (
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full text-xs border border-gray-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowImageInput(true)}
            className="flex items-center text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            <Image className="w-3.5 h-3.5 mr-1" />
            Attach Image URL
          </button>
        )}

        <div className="pt-3 border-t border-gray-100 flex items-center justify-end space-x-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700" disabled={!content.trim()}>
            <Send className="w-3.5 h-3.5 mr-1.5" />
            Publish Post
          </Button>
        </div>
      </form>
    </Modal>
  );
};
