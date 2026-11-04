import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Avatar } from '@/components/common/Avatar';
import { useUserContext } from '@/context/UserContext';
import type { User } from '@/types';

export const UserManagement: React.FC = () => {
  const { users } = useUserContext();
  const [userList, setUserList] = useState<User[]>(users);
  const [search, setSearch] = useState('');

  const filtered = userList.filter((u) =>
    u.fullName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.profession?.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleRole = (userId: string) => {
    setUserList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return { ...u, role: u.role === 'admin' ? 'user' : 'admin' };
        }
        return u;
      })
    );
  };

  const handleToggleStatus = (userId: string) => {
    setUserList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const isActive = u.privacy?.profileVisibility !== 'private';
          return {
            ...u,
            privacy: {
              ...u.privacy,
              profileVisibility: isActive ? 'private' : 'public',
              locationVisibility: 'approximate',
              pauseDiscovery: isActive,
            },
          };
        }
        return u;
      })
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs space-y-4 p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-gray-900">User Moderation & Access Control</h3>
          <p className="text-xs text-gray-500">Manage registered migrant members and administrative roles.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search member..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-600">
          <thead className="bg-gray-50 text-gray-700 uppercase font-semibold text-[10px] tracking-wider border-y border-gray-200">
            <tr>
              <th className="py-3 px-4">Member</th>
              <th className="py-3 px-4">Hometown</th>
              <th className="py-3 px-4">Locality</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((u) => {
              const isAdmin = u.role === 'admin';
              return (
                <tr key={u.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-3">
                      <Avatar src={u.avatar || u.photo} name={u.fullName} size="sm" />
                      <div>
                        <div className="font-bold text-gray-900">{u.fullName}</div>
                        <div className="text-[11px] text-gray-400">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    {u.hometown?.city ? `${u.hometown.city}, ${u.hometown.state}` : 'Not set'}
                  </td>
                  <td className="py-3.5 px-4">
                    {u.currentLocation?.locality || 'Cyber City'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isAdmin
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => handleToggleRole(u.id)}
                      className="text-xs text-indigo-600 hover:text-indigo-900 font-semibold"
                    >
                      {isAdmin ? 'Demote' : 'Make Admin'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(u.id)}
                      className="text-xs text-amber-600 hover:text-amber-800 font-semibold ml-2"
                    >
                      Toggle Status
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

