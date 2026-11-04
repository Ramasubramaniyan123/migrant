import React from 'react';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <Link to="/" className="text-3xl font-bold text-blue-600">
              MigrantCommunity
            </Link>
            <p className="text-gray-600 mt-2">Connect with your community</p>
          </div>
          <Outlet />
        </div>
        <div className="text-center mt-6 text-sm text-gray-600">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};
