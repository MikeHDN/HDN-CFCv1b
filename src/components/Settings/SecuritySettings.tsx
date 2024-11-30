import React from 'react';
import { Key, Shield, Lock } from 'lucide-react';

export default function SecuritySettings() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Key className="w-5 h-5 text-blue-500" />
          <span>API Keys</span>
        </div>
        <button className="px-4 py-2 bg-blue-800 hover:bg-blue-700 rounded-lg">
          Manage
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="w-5 h-5 text-blue-500" />
          <span>Two-Factor Authentication</span>
        </div>
        <button className="px-4 py-2 bg-blue-800 hover:bg-blue-700 rounded-lg">
          Enable
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Lock className="w-5 h-5 text-blue-500" />
          <span>Session Management</span>
        </div>
        <button className="px-4 py-2 bg-blue-800 hover:bg-blue-700 rounded-lg">
          View
        </button>
      </div>
    </div>
  );
}