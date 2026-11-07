import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { communityService } from '@/services/communityService';
import { languageById } from '@/services/userService';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/utils/constants';
import { formatCount } from '@/utils/formatters';
import Badge from '@/components/common/Badge';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import Loader from '@/components/common/Loader';
import LocationBadge from '@/components/shared/LocationBadge';
import CommunityFeed from './CommunityFeed';
import CreatePostModal from './CreatePostModal';

/** Detail view for a single community: header, membership controls and its feed. */
export default function CommunityDetailsPage() {
  const {
    communityId: communityIdParam
  } = useParams();
  const communityId = Number(communityIdParam);
  const {
    user
  } = useAuth();
  const userId = user?.id;
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const loadPosts = useCallback(async () => {
    if (!Number.isFinite(communityId)) return;
    setPosts(await communityService.getPosts(communityId));
  }, [communityId]);
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!Number.isFinite(communityId)) {
        setIsNotFound(true);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setIsNotFound(false);
      try {
        const row = await communityService.getCommunityById(communityId);
        if (cancelled) return;
        setCommunity(row);
        const feed = await communityService.getPosts(communityId);
        if (cancelled) return;
        setPosts(feed);
        if (userId) {
          const member = await communityService.isMember(userId, communityId);
          if (!cancelled) setIsMember(member);
        } else {
          setIsMember(false);
        }
      } catch {
        if (!cancelled) setIsNotFound(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [communityId, userId]);
  const toggleMembership = async () => {
    if (!userId || !community) return;
    if (isMember) {
      await communityService.leaveCommunity(userId, community.id);
    } else {
      await communityService.joinCommunity(userId, community.id);
    }
    const [updated, member] = await Promise.all([communityService.getCommunityById(community.id), communityService.isMember(userId, community.id)]);
    setCommunity(updated);
    setIsMember(member);
  };
  const handleCreatePost = async (content, imageUrl) => {
    if (!userId || !community) return;
    setIsSubmitting(true);
    try {
      await communityService.createPost(community.id, userId, content, imageUrl ?? null);
      await loadPosts();
      setIsCreateOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isLoading) {
    return <Loader label="Loading community…" />;
  }
  if (isNotFound || !community) {
    return <div className="mx-auto w-full max-w-3xl">
        <EmptyState title="Community not found" description="This community may have been removed or the link is incorrect." action={<Link to={ROUTES.communities}>
              <Button variant="secondary">Back to communities</Button>
            </Link>} />
      </div>;
  }
  const language = languageById(community.languageId);
  return <div className="mx-auto w-full max-w-4xl space-y-6">
      <Link to={ROUTES.communities} className="inline-flex items-center gap-1 text-sm text-brand-700 hover:underline">
        ← Back to communities
      </Link>

      <header className="card space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="page-title">{community.name}</h1>
              {language && <Badge variant="neutral">{language.name}</Badge>}
              {!community.isPublic && <Badge variant="warning">Private</Badge>}
            </div>
            <p className="text-sm text-slate-600">{community.description}</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button variant={isMember ? 'secondary' : 'primary'} onClick={() => void toggleMembership()}>
              {isMember ? 'Leave community' : 'Join community'}
            </Button>
            {isMember && <Button onClick={() => setIsCreateOpen(true)}>New post</Button>}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4 text-sm text-slate-600">
          <LocationBadge city={community.locationCity} country={community.locationCountry} />
          <span>{formatCount(community.memberCount)} members</span>
        </div>
      </header>

      <CommunityFeed posts={posts} onLike={async post => {
      await communityService.likePost(post.id);
      await loadPosts();
    }} canInteract={isMember} />

      <CreatePostModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSubmit={handleCreatePost} isSubmitting={isSubmitting} />
    </div>;
}
