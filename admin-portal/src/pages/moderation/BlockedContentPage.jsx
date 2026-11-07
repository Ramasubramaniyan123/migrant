import { useCallback, useEffect, useState } from 'react';
import { ShieldOff, RotateCcw, Trash2 } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/common/DataTable';
import Button from '@/components/common/Button';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import StatusBadge from '@/components/common/StatusBadge';
import { postService } from '@/services/postService';
import { formatDateTime } from '@/utils/formatters';

export default function BlockedContentPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [confirm, setConfirm] = useState(null); // { post, action: 'restore' | 'remove' }

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await postService.list({ flaggedOnly: true, pageSize: 50 });
      setPosts(res.items);
    } catch (err) {
      setError(err.message || 'Failed to load blocked content');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const runAction = async () => {
    const { post, action } = confirm;
    setBusyId(post.id);
    setActionError(null);
    try {
      if (action === 'restore') await postService.setFlagged(post.id, false);
      else await postService.remove(post.id);
      setConfirm(null);
      await load();
    } catch (err) {
      setActionError(err.message || 'Action failed');
    } finally {
      setBusyId(null);
    }
  };

  const columns = [
    {
      key: 'content',
      header: 'Content',
      render: p => (
        <div className="max-w-lg">
          <p className="truncate text-sm text-slate-700 dark:text-slate-300">{p.content}</p>
          <p className="mt-0.5 text-xs text-slate-400">
            {p.authorName} · {p.communityName}
          </p>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: () => (
        <StatusBadge tone="red" dot>Blocked / flagged</StatusBadge>
      )
    },
    {
      key: 'likes',
      header: 'Likes',
      render: p => <span className="text-sm text-slate-600 dark:text-slate-400">{p.likeCount}</span>
    },
    {
      key: 'comments',
      header: 'Comments',
      render: p => <span className="text-sm text-slate-600 dark:text-slate-400">{p.commentCount}</span>
    },
    {
      key: 'created',
      header: 'Posted',
      render: p => <span className="text-sm text-slate-500">{formatDateTime(p.createdAt)}</span>
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'w-44',
      render: p => (
        <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
          <Button
            size="sm"
            variant="secondary"
            leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
            onClick={() => setConfirm({ post: p, action: 'restore' })}
            disabled={busyId === p.id}
          >
            Restore
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-red-600 hover:bg-red-50"
            leftIcon={<Trash2 className="h-3.5 w-3.5" />}
            onClick={() => setConfirm({ post: p, action: 'remove' })}
            disabled={busyId === p.id}
          >
            Remove
          </Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title="Blocked content"
        description="Flagged posts that have been hidden pending review. Restore or permanently remove them."
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
        <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <ShieldOff className="h-4 w-4 text-red-500" />
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Flagged / blocked posts
          </h2>
        </div>
        <DataTable
          columns={columns}
          rows={posts}
          rowKey={p => p.id}
          isLoading={loading}
          error={error}
          emptyTitle="No blocked content"
          emptyDescription="Nothing is currently flagged or blocked."
        />
      </div>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={runAction}
        title={confirm?.action === 'restore' ? 'Restore content' : 'Permanently remove content'}
        message={
          confirm?.action === 'restore'
            ? `Restore the post by ${confirm.post.authorName}? It will become visible again.`
            : `Permanently remove the post by ${confirm.post.authorName}? This cannot be undone.`
        }
        confirmLabel={confirm?.action === 'restore' ? 'Restore' : 'Remove'}
        danger={confirm?.action === 'remove'}
        isLoading={!!busyId}
      />
    </div>
  );
}
