import React, { useState } from 'react';
import { MapPin, ShieldCheck, Compass, Users } from 'lucide-react';
import type { User } from '@/types';

interface NearbyMapProps {
  users: User[];
  currentLocality?: string;
  onSelectUser?: (userId: string) => void;
}

export const NearbyMap: React.FC<NearbyMapProps> = ({
  users,
  currentLocality = 'Cyber City',
  onSelectUser,
}) => {
  const [selectedPin, setSelectedPin] = useState<User | null>(null);

  // Group users by approximate locality
  const localities = [
    { name: 'Cyber City', top: '28%', left: '38%', count: 0 },
    { name: 'DLF Phase 2', top: '38%', left: '52%', count: 0 },
    { name: 'DLF Phase 1', top: '48%', left: '60%', count: 0 },
    { name: 'Sector 29', top: '56%', left: '42%', count: 0 },
    { name: 'Sector 56', top: '72%', left: '68%', count: 0 },
    { name: 'Golf Course Road', top: '62%', left: '58%', count: 0 },
  ];

  // Distribute users into localities
  const populatedLocalities = localities.map((loc) => {
    const matched = users.filter((u) => u.currentLocation?.locality === loc.name);
    return { ...loc, count: matched.length, members: matched };
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
      <div className="p-4 bg-gray-50/80 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 text-gray-700">
          <Compass className="w-4 h-4 text-indigo-600" />
          <span className="font-semibold">Interactive Gurugram Proximity Grid</span>
        </div>
        <div className="flex items-center text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 mr-1" />
          Privacy-protected: exact GPS is hidden, showing approximate clusters
        </div>
      </div>

      <div className="relative w-full h-[460px] bg-slate-900 overflow-hidden select-none">
        {/* Subtle Map Grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />

        {/* Center Radar Waves for Current User in Cyber City */}
        <div className="absolute top-[28%] left-[38%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-32 h-32 rounded-full border border-indigo-500/30 animate-ping" />
          <div className="absolute inset-0 w-64 h-64 -translate-x-1/4 -translate-y-1/4 rounded-full border border-indigo-500/20" />
          <div className="absolute inset-0 w-96 h-96 -translate-x-1/3 -translate-y-1/3 rounded-full border border-indigo-500/10" />
        </div>

        {/* You Are Here Pin */}
        <div className="absolute top-[28%] left-[38%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
          <div className="w-4 h-4 rounded-full bg-emerald-400 ring-4 ring-emerald-400/40 shadow-lg" />
          <span className="mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white shadow-md">
            You ({currentLocality})
          </span>
        </div>

        {/* Locality Cluster Nodes */}
        {populatedLocalities.map((loc, i) => (
          <div
            key={i}
            style={{ top: loc.top, left: loc.left }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
            onClick={() => {
              if (loc.members.length > 0) {
                setSelectedPin(loc.members[0]);
              }
            }}
          >
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-indigo-600/90 text-white text-xs font-semibold shadow-lg group-hover:scale-110 group-hover:bg-indigo-500 transition-all border border-indigo-400/40">
              <MapPin className="w-3.5 h-3.5" />
              <span>{loc.name}</span>
              <span className="ml-1 bg-white/20 px-1.5 py-0.2 rounded-full text-[10px]">
                {loc.count}
              </span>
            </div>
          </div>
        ))}

        {/* Selected Member Popup card */}
        {selectedPin && (
          <div className="absolute bottom-4 right-4 z-30 max-w-xs w-full bg-white rounded-xl shadow-2xl p-4 border border-gray-100 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-3">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Cluster Member
              </span>
              <button
                onClick={() => setSelectedPin(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <img
                src={selectedPin.avatar}
                alt={selectedPin.fullName}
                className="w-11 h-11 rounded-full bg-gray-100 object-cover"
              />
              <div className="min-w-0">
                <p className="font-bold text-sm text-gray-900 truncate">{selectedPin.fullName}</p>
                <p className="text-xs text-indigo-600 font-medium">
                  {typeof selectedPin.motherTongue === 'string' ? selectedPin.motherTongue : 'Native speaker'}
                </p>
                <p className="text-[11px] text-gray-500 truncate">
                  From {selectedPin.hometown?.city}, {selectedPin.hometown?.state}
                </p>
              </div>
            </div>
            {onSelectUser && (
              <button
                onClick={() => onSelectUser(selectedPin.id)}
                className="mt-3 w-full py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-lg text-xs transition-colors"
              >
                View Full Profile
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
