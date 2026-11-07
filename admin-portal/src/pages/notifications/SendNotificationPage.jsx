import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/common/Button';
import { Input, Textarea, Select } from '@/components/common/Input';
import { notificationService } from '@/services/notificationService';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { ADMIN_ROUTES } from '@/utils/constants';
import { isNonEmpty } from '@/utils/validators';
import { ArrowLeft, CheckCircle2, Send } from 'lucide-react';

const TYPES = [
  { value: 'ANNOUNCEMENT', label: 'Announcement' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
  { value: 'POLICY', label: 'Policy' },
  { value: 'EVENT', label: 'Event' }
];

const AUDIENCES = [
  { value: 'ALL', label: 'All users' },
  { value: 'ACTIVE_USERS', label: 'Active users' },
  { value: 'NEW_USERS', label: 'New users' },
  { value: 'COMMUNITY_MEMBERS', label: 'Community members' }
];

export default function SendNotificationPage() {
  const navigate = useNavigate();
  const { admin } = useAdminAuth();
  const [form, setForm] = useState({ title: '', body: '', type: 'ANNOUNCEMENT', audience: 'ALL' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const setField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!isNonEmpty(form.title)) next.title = 'Title is required';
    if (!isNonEmpty(form.body)) next.body = 'Message body is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await notificationService.broadcast(
        {
          title: form.title.trim(),
          body: form.body.trim(),
          type: form.type,
          audience: form.audience
        },
        admin?.name ?? 'Unknown admin'
      );
      setSent(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to send notification');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Send notification"
        description="Broadcast a message to a segment of platform users."
        breadcrumbs={[
          { label: 'Dashboard', to: ADMIN_ROUTES.dashboard },
          { label: 'Notifications', to: ADMIN_ROUTES.notifications },
          { label: 'Send notification' }
        ]}
      />

      {submitError ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</div>
      ) : null}

      {sent ? (
        <div className="card p-6 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />
          <h2 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">Notification sent</h2>
          <p className="mt-1 text-sm text-slate-500">
            Your message was broadcast to the selected audience and recorded in the history.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <Button variant="secondary" onClick={() => {
              setSent(false);
              setForm({ title: '', body: '', type: 'ANNOUNCEMENT', audience: 'ALL' });
            }}>
              Send another
            </Button>
            <Button onClick={() => navigate(ADMIN_ROUTES.notificationHistory)}>
              View history
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card space-y-5 p-6">
          <Input
            label="Title"
            name="title"
            value={form.title}
            onChange={e => setField('title', e.target.value)}
            error={errors.title}
            placeholder="e.g. Scheduled maintenance this Sunday"
            required
          />
          <Textarea
            label="Message"
            name="body"
            value={form.body}
            onChange={e => setField('body', e.target.value)}
            error={errors.body}
            placeholder="Write the notification body…"
            required
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select label="Type" name="type" value={form.type} onChange={e => setField('type', e.target.value)}>
              {TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </Select>
            <Select label="Audience" name="audience" value={form.audience} onChange={e => setField('audience', e.target.value)}>
              {AUDIENCES.map(a => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </Select>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-5 dark:border-slate-700">
            <Button variant="secondary" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={() => navigate(ADMIN_ROUTES.notifications)}>
              Cancel
            </Button>
            <Button type="submit" leftIcon={<Send className="h-4 w-4" />} isLoading={isSubmitting}>
              Send notification
            </Button>
          </div>
        </form>
      )}

      <p className="mt-4 text-sm">
        <Link to={ADMIN_ROUTES.notificationHistory} className="text-blue-600 hover:underline">
          View notification history →
        </Link>
      </p>
    </div>
  );
}
