import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, Trash2, UserPlus, MessageSquare, Heart, Users } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Avatar } from '@/components/common/Avatar';
import { EmptyState } from '@/components/common/EmptyState';
import { useNotificationContext } from '@/context/NotificationContext';
import type { NotificationType } from '@/types';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationContext();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = filter === 'unread' ? notifications.filter((n) => !n.read && !n.isRead) : notifications;

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'connection_request':
      case 'connection_accepted':
        return <UserPlus className="w-4 h-4 text-indigo-600" />;
      case 'new_message':
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case 'post_like':
      case 'comment_like':
        return <Heart className="w-4 h-4 text-rose-600" />;
      case 'community_invite':
        return <Users className="w-4 h-4 text-emerald-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Notifications
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Stay updated with connection requests, community replies, and local migrant news.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            className="text-xs text-indigo-600 border-indigo-200 hover:bg-indigo-50 self-start sm:self-auto"
          >
            <CheckCheck className="w-3.5 h-3.5 mr-1" />
            Mark all read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 pb-2 text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            filter === 'all'
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            filter === 'unread'
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications list */}
      {filtered.length > 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden shadow-xs">
          {filtered.map((notif) => {
            const isUnread = !notif.read && !notif.isRead;
            return (
              <div
                key={notif.id}
                className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors ${
                  isUnread ? 'bg-indigo-50/40' : 'hover:bg-gray-50/60'
                }`}
              >
                <div className="flex items-start space-x-3.5 min-w-0">
                  <div className="mt-0.5 p-2 rounded-xl bg-gray-100 shrink-0">
                    {getIcon(notif.type)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xs font-bold text-gray-900">{notif.title}</h4>
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-700 mt-0.5">{notif.message}</p>
                    {notif.actionUrl && (
                      <Link
                        to={notif.actionUrl}
                        onClick={() => markAsRead(notif.id)}
                        className="text-xs font-semibold text-indigo-600 hover:underline mt-1.5 inline-block"
                      >
                        View Activity →
                      </Link>
                    )}
                    <span className="text-[10px] text-gray-400 block mt-1">
                      {new Date(notif.createdAt || notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(notif.createdAt || notif.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  {isUnread && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-gray-100"
                      title="Mark as read"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notif.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                    title="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="All Caught Up!"
          description="You don't have any notifications at the moment."
          className="bg-white rounded-2xl border border-gray-200 p-12"
        />
      )}
    </div>
  );
};

