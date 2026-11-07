import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/common/Button';
import { Input, Select } from '@/components/common/Input';
import { adminAuthService } from '@/services/adminAuthService';
import { ADMIN_ROUTES, ADMIN_ROLE_LABELS } from '@/utils/constants';
import { isValidEmail } from '@/utils/validators';
import { ArrowLeft, UserPlus } from 'lucide-react';

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'SUPPORT', 'ANALYST'];

export default function CreateAdminPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', role: 'ADMIN' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!isValidEmail(form.email)) next.email = 'Enter a valid email address';
    if (!form.role) next.role = 'Role is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await adminAuthService.createAdmin({
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role
      });
      navigate(ADMIN_ROUTES.administrators);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to create administrator');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Add administrator"
        description="Create a new admin portal account. The administrator will receive an invitation to set their password."
        breadcrumbs={[
          { label: 'Dashboard', to: ADMIN_ROUTES.dashboard },
          { label: 'Administrators', to: ADMIN_ROUTES.administrators },
          { label: 'Add administrator' }
        ]}
      />

      {submitError ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="card space-y-5 p-6">
        <Input
          label="Full name"
          name="name"
          value={form.name}
          onChange={e => setField('name', e.target.value)}
          error={errors.name}
          placeholder="e.g. Priya Sharma"
          required
        />
        <Input
          label="Email address"
          name="email"
          type="email"
          value={form.email}
          onChange={e => setField('email', e.target.value)}
          error={errors.email}
          placeholder="name@migrantconnect.in"
          required
        />
        <Select
          label="Role"
          name="role"
          value={form.role}
          onChange={e => setField('role', e.target.value)}
          error={errors.role}
        >
          {ADMIN_ROLES.map(role => (
            <option key={role} value={role}>{ADMIN_ROLE_LABELS[role]}</option>
          ))}
        </Select>
        <p className="text-xs text-slate-500">
          Role permissions are defined on the <Link to={ADMIN_ROUTES.rolesPermissions} className="text-blue-600 hover:underline">Roles &amp; permissions</Link> page.
        </p>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-5 dark:border-slate-700">
          <Button variant="secondary" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={() => navigate(ADMIN_ROUTES.administrators)}>
            Cancel
          </Button>
          <Button type="submit" leftIcon={<UserPlus className="h-4 w-4" />} isLoading={isSubmitting}>
            Create administrator
          </Button>
        </div>
      </form>
    </div>
  );
}
