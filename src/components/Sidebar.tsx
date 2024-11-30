import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Shield,
  AlertTriangle,
  Map,
  Brain,
  ShieldAlert,
  FileText,
  Settings,
  Users,
  Scan
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { name: 'Incidents', icon: AlertTriangle, path: '/incidents' },
  { name: 'Threat Intel', icon: Shield, path: '/threat-intel' },
  { name: 'Threat Map', icon: Map, path: '/threat-map' },
  { name: 'AI Advisor', icon: Brain, path: '/ai-advisor' },
  { name: 'Vulnerability Management', icon: ShieldAlert, path: '/vulnerability-management' },
  { name: 'Breached Accounts', icon: Users, path: '/breached-accounts' },
  { name: 'HDN-NEON Defense', icon: Scan, path: '/neon-defense' },
  { name: 'Documentation', icon: FileText, path: '/docs' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

export default function Sidebar() {
  return (
    <nav className="w-64 bg-gray-800 min-h-[calc(100vh-5rem)] p-4">
      <div className="space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}