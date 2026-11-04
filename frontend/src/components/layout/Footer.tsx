import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-gray-600 text-sm">
            © 2024 MigrantCommunity. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm">
            <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link to="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-gray-600 hover:text-blue-600 transition-colors">
              Terms
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
