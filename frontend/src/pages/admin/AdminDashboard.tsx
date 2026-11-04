import React, { useState } from 'react';
import { Users, ShieldAlert, AlertTriangle, Layers } from 'lucide-react';
import { UserManagement } from './UserManagement';
import { ReportManagement } from './ReportManagement';
import { CommunityManagement } from './CommunityManagement';
import { useUserContext } from '@/context/UserContext';
import communitiesData from '@/data/communities.json';

export const AdminDashboard: React.FC = () => {
  const { users } = useUserContext();
  const [activeTab, setActiveTab] = useState<'users' | 'reports' | 'communities'>('users');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold mb-2">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Platform Moderator Console</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          System Administration & Oversight
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Monitor community trust & safety, manage members, and resolve abuse reports.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Registered Members</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">{users.length}</p>
          <span className="text-[11px] text-indigo-600 font-medium">All verified migrants</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Pending Abuse Reports</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-amber-600">2</p>
          <span className="text-[11px] text-amber-700 font-medium">Requires review</span>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Active Communities</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-gray-900">{communitiesData.length}</p>
          <span className="text-[11px] text-purple-600 font-medium">10+ languages</span>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex space-x-2 border-b border-gray-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'users'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          User Management ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'reports'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          Reports & Abuse (2)
        </button>
        <button
          onClick={() => setActiveTab('communities')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'communities'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          Community Circles ({communitiesData.length})
        </button>
      </div>

      {/* Panel */}
      {activeTab === 'users' && <UserManagement />}
      {activeTab === 'reports' && <ReportManagement />}
      {activeTab === 'communities' && <CommunityManagement />}
    </div>
  );
};

