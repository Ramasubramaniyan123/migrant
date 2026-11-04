import React, { useState } from 'react';
import { Shield, User, Bell, Key } from 'lucide-react';
import { PrivacySettings } from './PrivacySettings';
import { AccountSettings } from './AccountSettings';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'account'>('privacy');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Settings & Preferences
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Control your privacy radius, profile visibility, notifications, and account security.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 pb-2 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('privacy')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'privacy'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Location & Privacy</span>
        </button>

        <button
          onClick={() => setActiveTab('account')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'account'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Account & Security</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'privacy' ? <PrivacySettings /> : <AccountSettings />}
    </div>
  );
};

