import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlagOff, Trash2 } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/common/DataTable';
import Button from '@/components/common/Button';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import StatusBadge from '@/components/common/StatusBadge';
import { postService } from '@/services/postService';
import { ADMIN_ROUTES } from '@/utils/constants';
import { formatDateTime } from '@/utils/formatters';

export default function FlaggedPostsPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [removeTarget, setRemoveTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await postService.list({ flaggedOnly: true, pageSize: 50 });
      setPosts(res.items);
    } catch (err) {
      setError(err.message || 'Failed to load flagged posts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleUnflag = async post => {
    setBusyId(post.id);
    setActionError(null);
    try {
      await postService.setFlagged(post.id, false);
      await load();
    } catch (err) {
      setActionError(err.message || 'Failed to unflag post');
    } finally {
      setBusyId(null);
    }
  };

  const handleRemove = async () => {
    setBusyId(removeTarget.id);
    setActionError(null);
    try {
      await postService.remove(removeTarget.id);
      setRemoveTarget(null);
      await load();
    } catch (err) {
      setActionError(err.message || 'Failed to remove post');
    } finally {
      setBusyId(null);
    }
  };

  const columns = [
    {
      key: 'author',
      header: 'Author',
      render: p => (
        <div>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{p.authorName}</p>
          <p className="text-xs text-slate-400">{p.communityName}</p>
        </div>
      )
    },
    {
      key: 'content',
      header: 'Content',
      render: p => (
        <p className="max-w-md truncate text-sm text-slate-600 dark:text-slate-400">{p.content}</p>
      )
    },
    {
      key: 'engagement',
      header: 'Engagement',
      render: p => (
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {p.likeCount} likes · {p.commentCount} comments
        </span>
      )
    },
    {
      key: 'created',
      header: 'Posted',
      render: p => <span className="text-sm text-slate-500">{formatDateTime(p.createdAt)}</span>
    },
    {
      key: 'status',
      header: 'Status',
      render: () => <StatusBadge tone="red" dot>Flagged</StatusBadge>
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'w-32',
      render: p => (
        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
          <Button
            size="sm"
            variant="secondary"
            leftIcon={<FlagOff className="h-3.5 w-3.5" />}
            onClick={() => handleUnflag(p)}
            isLoading={busyId === p.id && !removeTarget}
            disabled={busyId === p.id}
          >
            Unflag
          </Button>
          <button
            onClick={() => setRemoveTarget(p)}
            title="Remove post"
            className="rounded-lg p-1.5 text-red-600 transition-colors hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="Flagged posts"
        description="Posts currently flagged for review. Unflag to restore or remove permanently."
        breadcrumbs={[
          { label: 'Posts', to: ADMIN_ROUTES.posts },
          { label: 'Flagged' }
        ]}
      />

      {error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      {actionError ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      ) : null}

      <div className="card">
        <DataTable
          columns={columns}
          rows={posts}
          rowKey={p => p.id}
          isLoading={loading}
          error={error}
          emptyTitle="No flagged posts"
          emptyDescription="All posts are within policy."
          onRowClick={p => navigate(ADMIN_ROUTES.postDetails(p.id))}
        />
      </div>

      <ConfirmDialog
        open={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={handleRemove}
        title="Remove post"
        message={`Permanently remove the post by ${removeTarget?.authorName ?? 'this user'}? This cannot be undone.`}
        confirmLabel="Remove"
        danger
        isLoading={!!busyId}
      />
    </div>
  );
}
