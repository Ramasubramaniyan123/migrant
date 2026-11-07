import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flag, FlagOff, Trash2 } from 'lucide-react';
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

export default function PostsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [flaggedOnly, setFlaggedOnly] = useState(false);
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
        flaggedOnly,
        page,
        pageSize
      });
      setData(res);
    } catch (err) {
      setError(err.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, flaggedOnly, page, pageSize]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleFlag = async post => {
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
      key: 'flagged',
      header: 'Flagged',
      render: p =>
        p.isFlagged ? (
          <StatusBadge tone="red" dot>Flagged</StatusBadge>
        ) : (
          <span className="text-sm text-slate-400">—</span>
        )
    },
    {
      key: 'created',
      header: 'Created',
      render: p => <span className="text-sm text-slate-500">{formatDateTime(p.createdAt)}</span>
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'w-28',
      render: p => (
        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => toggleFlag(p)}
            title={p.isFlagged ? 'Unflag post' : 'Flag post'}
            className={p.isFlagged
              ? 'rounded-lg p-1.5 text-amber-600 transition-colors hover:bg-amber-50'
              : 'rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-amber-600'}
          >
            {p.isFlagged ? <FlagOff className="h-4 w-4" /> : <Flag className="h-4 w-4" />}
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
        title="Posts"
        description="Browse, flag and moderate community posts."
        actions={
          <Button variant="secondary" onClick={() => navigate(ADMIN_ROUTES.flaggedPosts)}>
            View flagged posts
          </Button>
        }
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
          placeholder="Search posts…"
          className="sm:max-w-sm"
        />
        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <input
            type="checkbox"
            checked={flaggedOnly}
            onChange={e => {
              setFlaggedOnly(e.target.checked);
              setPage(1);
            }}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          Flagged only
        </label>
      </div>

      <div className="card">
        <DataTable
          columns={columns}
          rows={data.items}
          rowKey={p => p.id}
          isLoading={loading}
          error={error}
          emptyTitle="No posts found"
          emptyDescription="Try adjusting your search or filters."
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
