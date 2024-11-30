import React from 'react';
import { Shield, Bell, User } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Header() {
  const { user } = useStore();

  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="px-8 py-6 flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <Shield className="w-10 h-10 text-blue-500" />
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">HDN</span>
              <span className="text-gray-400">|</span>
              <span className="text-xl">Cyber Fusion Center</span>
            </div>
            <span className="text-xs text-gray-400">© 2024 M.Goedeker MSc. & Hakdefnet GmbH</span>
          </div>
        </div>

        {/* Center section - HDN Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img src="/data/hdn-logo.svg" alt="HDN Logo" className="h-16" />
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-6">
          <button className="p-2 hover:bg-gray-700 rounded-full transition-colors relative">
            <Bell className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-medium">{user?.name || 'Security Analyst'}</div>
              <div className="text-xs text-gray-400">Online</div>
            </div>
            <User className="w-10 h-10 p-1.5 bg-gray-700 text-blue-400 rounded-full" />
          </div>
        </div>
      </div>
    </header>
  );
}