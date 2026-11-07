import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlagOff, Trash2 } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import DataTable from '@/components/common/DataTable';
import Pagination from '@/components/common/Pagination';
import SearchBar from '@/components/common/SearchBar';
import Button from '@/components/common/Button';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import StatusBadge from '@/components/common/StatusBadge';
import { postService } from '@/services/postService';
import { ADMIN_ROUTES } from '@/utils/constants';
import { formatDateTime } from '@/utils/formatters';

export default function PostModerationPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await postService.list({
        search: debouncedSearch,
        flaggedOnly: true,
        page,
        pageSize
      });
      setData(res);
    } catch (err) {
      setError(err.message || 'Failed to load flagged posts');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page, pageSize]);

  useEffect(() => {
    load();
  }, [load]);

  const handleUnflag = async post => {
    setActionError(null);
    try {
      await postService.setFlagged(post.id, false);
      await load();
    } catch (err) {
      setActionError(err.message || 'Failed to unflag post');
    }
  };

  const handleRemove = async () => {
    setBusy(true);
    setActionError(null);
    try {
      await postService.remove(removeTarget.id);
      setRemoveTarget(null);
      await load();
    } catch (err) {
      setActionError(err.message || 'Failed to remove post');
    } finally {
      setBusy(false);
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
      className: 'w-32',
      render: p => (
        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => handleUnflag(p)}
            title="Unflag post"
            className="rounded-lg p-1.5 text-amber-600 transition-colors hover:bg-amber-50"
          >
            <FlagOff className="h-4 w-4" />
          </button>
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

  const totalPages = Math.max(1, Math.ceil(data.total / pageSize));

  return (
    <div>
      <PageHeader
        title="Post moderation"
        description="Review posts flagged by users or automated systems."
      />

      {actionError ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      ) : null}

      <div className="card mb-4 flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <SearchBar
          value={search}
          onChange={setSearch}
          onDebouncedChange={v => {
            setDebouncedSearch(v);
            setPage(1);
          }}
          placeholder="Search flagged posts…"
          className="sm:max-w-sm"
        />
        <StatusBadge tone="amber" dot>Flagged only</StatusBadge>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          rows={data.items}
          rowKey={p => p.id}
          isLoading={loading}
          error={error}
          emptyTitle="No flagged posts"
          emptyDescription="All posts are currently within policy."
          onRowClick={p => navigate(ADMIN_ROUTES.postDetails(p.id))}
        />
        <Pagination
          page={page}
          totalPages={totalPages}
          total={data.total}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          itemLabel="posts"
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
        isLoading={busy}
      />
    </div>
  );
}
