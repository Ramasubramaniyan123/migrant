import React, { useState } from 'react';
import { ReceivedRequests } from './ReceivedRequests';
import { SentRequests } from './SentRequests';
import { MyConnections } from './MyConnections';
import { useConnectionContext } from '@/context/ConnectionContext';
import { Users, UserPlus, Clock } from 'lucide-react';

export const ConnectionsPage: React.FC = () => {
  const {
    connections,
    receivedRequests,
    sentRequests,
    acceptRequest,
    rejectRequest,
    removeConnection,
  } = useConnectionContext();

  const [activeTab, setActiveTab] = useState<'connections' | 'received' | 'sent'>('connections');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Your Network & Connections
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your personal connections and connection invitations with fellow migrants.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveTab('connections')}
            className={`pb-3 text-sm font-semibold border-b-2 flex items-center space-x-2 transition-all ${
              activeTab === 'connections'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>My Connections</span>
            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full font-bold">
              {connections.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('received')}
            className={`pb-3 text-sm font-semibold border-b-2 flex items-center space-x-2 transition-all ${
              activeTab === 'received'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Received Requests</span>
            {receivedRequests.length > 0 && (
              <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {receivedRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('sent')}
            className={`pb-3 text-sm font-semibold border-b-2 flex items-center space-x-2 transition-all ${
              activeTab === 'sent'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Sent Requests</span>
            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full font-bold">
              {sentRequests.length}
            </span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'connections' && (
        <MyConnections connections={connections} onRemove={removeConnection} />
      )}

      {activeTab === 'received' && (
        <ReceivedRequests
          requests={receivedRequests}
          onAccept={acceptRequest}
          onReject={rejectRequest}
        />
      )}

      {activeTab === 'sent' && (
        <SentRequests
          requests={sentRequests}
          onCancel={() => {
            alert('Request cancelled');
          }}
        />
      )}
    </div>
  );
};

