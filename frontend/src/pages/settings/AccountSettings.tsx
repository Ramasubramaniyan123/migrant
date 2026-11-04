import React, { useState } from 'react';
import { KeyRound, Bell, AlertTriangle, Check } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useAuth } from '@/hooks/useAuth';

export const AccountSettings: React.FC = () => {
  const { user, logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  // Email notifications
  const [emailDigest, setEmailDigest] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [savedNotifs, setSavedNotifs] = useState(false);

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setPasswordMsg('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg('Passwords do not match.');
      return;
    }
    setPasswordMsg('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordMsg(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Password Change */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs">
        <h2 className="text-lg font-bold text-gray-900 flex items-center mb-1">
          <KeyRound className="w-5 h-5 mr-2 text-indigo-600" />
          Security & Password
        </h2>
        <p className="text-xs text-gray-500 mb-6">Update your account login credentials</p>

        <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
          <Input
            type="password"
            label="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <Input
            type="password"
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            helperText="At least 8 characters"
            required
          />
          <Input
            type="password"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {passwordMsg && (
            <p className={`text-xs p-2.5 rounded-lg ${passwordMsg.includes('success') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
              {passwordMsg}
            </p>
          )}

          <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700">
            Update Password
          </Button>
        </form>
      </div>

      {/* Notifications Preferences */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs">
        <h2 className="text-lg font-bold text-gray-900 flex items-center mb-1">
          <Bell className="w-5 h-5 mr-2 text-indigo-600" />
          Email Notifications
        </h2>
        <p className="text-xs text-gray-500 mb-6">Choose how frequently you hear from your communities</p>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
            <div>
              <p className="text-xs font-bold text-gray-900">Weekly Community Digest</p>
              <p className="text-[11px] text-gray-500">Summary of upcoming festivals, meetups, and new members from your hometown</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEmailDigest(!emailDigest);
                setSavedNotifs(true);
                setTimeout(() => setSavedNotifs(false), 2000);
              }}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                emailDigest ? 'bg-indigo-600 justify-end' : 'bg-gray-300 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
            <div>
              <p className="text-xs font-bold text-gray-900">Immediate Connection Requests</p>
              <p className="text-[11px] text-gray-500">Email alerts when someone sends you a message or connection request</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEmailAlerts(!emailAlerts);
                setSavedNotifs(true);
                setTimeout(() => setSavedNotifs(false), 2000);
              }}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                emailAlerts ? 'bg-indigo-600 justify-end' : 'bg-gray-300 justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
            </button>
          </div>
        </div>

        {savedNotifs && (
          <p className="mt-3 text-xs text-emerald-600 font-semibold flex items-center">
            <Check className="w-3.5 h-3.5 mr-1" /> Preferences saved!
          </p>
        )}
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl border border-red-200 p-6 sm:p-8 shadow-xs">
        <h2 className="text-lg font-bold text-red-600 flex items-center mb-1">
          <AlertTriangle className="w-5 h-5 mr-2" />
          Danger Zone
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          Permanently remove your account and purge all location records from the directory.
        </p>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="text-xs border-gray-300 text-gray-700"
          >
            Log Out of All Sessions
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              if (confirm('Are you sure you want to delete your profile? This cannot be undone.')) {
                logout();
              }
            }}
            className="text-xs"
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
};

