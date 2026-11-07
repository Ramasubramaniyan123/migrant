import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Flag, FlagOff, Trash2 } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/common/Button';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Loader from '@/components/common/Loader';
import StatusBadge from '@/components/common/StatusBadge';
import { postService } from '@/services/postService';
import { ADMIN_ROUTES } from '@/utils/constants';
import { formatDateTime } from '@/utils/formatters';

export default function PostDetailsPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, c] = await Promise.all([postService.getById(id), postService.getComments(id)]);
      setPost(p);
      setComments(c);
    } catch (err) {
      setError(err.message || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleFlag = async () => {
    setActionError(null);
    try {
      await postService.setFlagged(post.id, !post.isFlagged);
      await load();
    } catch (err) {
      setActionError(err.message || 'Failed to update flag');
    }
  };

  const handleRemove = async () => {
    setBusy(true);
    setActionError(null);
    try {
      await postService.remove(post.id);
      setRemoveOpen(false);
      await load();
    } catch (err) {
      setActionError(err.message || 'Failed to remove post');
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Post details" />
        <Loader label="Loading post…" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div>
        <PageHeader title="Post details" />
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error || 'Post not found'}
        </div>
        <Link to={ADMIN_ROUTES.posts} className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-700">
          ← Back to posts
        </Link>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Post details"
        description={`Posted by ${post.authorName} on ${formatDateTime(post.createdAt)}`}
        breadcrumbs={[
          { label: 'Posts', to: ADMIN_ROUTES.posts },
          { label: post.id }
        ]}
        actions={
          <Link to={ADMIN_ROUTES.posts}>
            <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Back
            </Button>
          </Link>
        }
      />

      {actionError ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <div className="card p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{post.authorName}</p>
                <p className="text-xs text-slate-400">{post.communityName}</p>
              </div>
              {post.isFlagged ? (
                <StatusBadge tone="red" dot>Flagged</StatusBadge>
              ) : (
                <StatusBadge tone="green" dot>Visible</StatusBadge>
              )}
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {post.content}
            </p>
            {post.imageUrl ? (
              <img
                src={post.imageUrl}
                alt="Post attachment"
                className="mt-4 max-h-80 rounded-lg border border-slate-200 object-cover dark:border-slate-700"
              />
            ) : null}
            <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-4 text-sm text-slate-500 dark:border-slate-800">
              <span>♥ {post.likeCount} likes</span>
              <span>{post.commentCount} comments</span>
              <span>{formatDateTime(post.createdAt)}</span>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Comments ({comments.length})
            </h2>
            {comments.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">No comments on this post.</p>
            ) : (
              <ul className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
                {comments.map(c => (
                  <li key={c.id} className="py-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{c.authorName}</p>
                      <span className="text-xs text-slate-400">{formatDateTime(c.createdAt)}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{c.content}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div>
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Moderation</h2>
            <div className="mt-4 space-y-3">
              <Button
                variant="secondary"
                fullWidth
                leftIcon={post.isFlagged ? <FlagOff className="h-4 w-4" /> : <Flag className="h-4 w-4" />}
                onClick={toggleFlag}
              >
                {post.isFlagged ? 'Unflag post' : 'Flag post'}
              </Button>
              <Button
                variant="danger"
                fullWidth
                leftIcon={<Trash2 className="h-4 w-4" />}
                onClick={() => setRemoveOpen(true)}
              >
                Remove post
              </Button>
            </div>
          </div>

          <div className="card mt-4 p-5">
            <h3 className="text-xs font-medium uppercase tracking-wide text-slate-400">Details</h3>
            <dl className="mt-2 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Post ID</dt>
                <dd className="truncate text-slate-800 dark:text-slate-200">{post.id}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Author ID</dt>
                <dd className="truncate text-slate-800 dark:text-slate-200">{post.authorId}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Community</dt>
                <dd className="truncate text-slate-800 dark:text-slate-200">{post.communityName}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={removeOpen}
        onClose={() => setRemoveOpen(false)}
        onConfirm={handleRemove}
        title="Remove post"
        message={`Permanently remove this post by ${post.authorName}? This cannot be undone.`}
        confirmLabel="Remove"
        danger
        isLoading={busy}
      />
    </div>
  );
}
