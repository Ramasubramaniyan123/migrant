import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/utils/formatters';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Loader from '@/components/common/Loader';
import Modal from '@/components/common/Modal';

/** Account details, display-name editing and session controls. */
export default function AccountSettings() {
  const {
    user,
    updateProfile,
    logout,
    isLoading
  } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState(user?.profile.firstName ?? '');
  const [lastName, setLastName] = useState(user?.profile.lastName ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  if (isLoading) {
    return <Loader label="Loading account…" />;
  }
  if (!user) {
    return <p className="muted">Sign in to manage your account.</p>;
  }
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        firstName: firstName.trim() || user.profile.firstName,
        lastName: lastName.trim()
      });
    } finally {
      setIsSaving(false);
    }
  };
  const handleSignOut = () => {
    void logout().then(() => navigate('/'));
  };
  return <div className="space-y-6">
      <section className="card space-y-4">
        <h2 className="text-base font-semibold text-slate-900">Profile details</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="First name" value={firstName} onChange={event => setFirstName(event.target.value)} />
          <Input label="Last name" value={lastName} onChange={event => setLastName(event.target.value)} />
        </div>

        <Input label="Email address" value={user.email} readOnly hint="Email cannot be changed in the demo." />

        <dl className="space-y-1 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Member since</dt>
            <dd className="font-medium text-slate-800">{formatDate(user.createdAt)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Role</dt>
            <dd className="font-medium text-slate-800">{user.role === 'ADMIN' ? 'Administrator' : 'Member'}</dd>
          </div>
        </dl>

        <div className="flex justify-end">
          <Button onClick={() => void handleSave()} isLoading={isSaving}>
            Save changes
          </Button>
        </div>
      </section>

      <section className="card space-y-4">
        <h2 className="text-base font-semibold text-slate-900">Session</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={handleSignOut}>
            Sign out
          </Button>
          <Button variant="danger" onClick={() => setIsDeleteOpen(true)}>
            Delete account
          </Button>
        </div>
      </section>

      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete account" size="sm" footer={<div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => {
        setIsDeleteOpen(false);
        handleSignOut();
      }}>
              Delete and sign out
            </Button>
          </div>}>
        <p className="text-sm text-slate-600">
          This prototype keeps everything in memory, so deleting your account simply clears the demo
          session.
        </p>
      </Modal>
    </div>;
}
