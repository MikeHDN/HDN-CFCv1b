import React, { useEffect, useState } from 'react';
import { Shield, AlertTriangle, Users, Activity } from 'lucide-react';
import ThreatStats from '../components/Dashboard/ThreatStats';
import DomainStats from '../components/Dashboard/DomainStats';
import BreachedAccounts from '../components/Dashboard/BreachedAccounts';
import NeonDefense from '../components/Dashboard/NeonDefense';
import { getTopStats } from '../services/stats';
import { loadInitialStats } from '../services/stats/loader';

export default function Dashboard() {
  const [stats, setStats] = useState({
    topAsns: [],
    topDomains: [],
    totalEntries: 0,
    totalCves: 0
  });

  const quickStats = [
    { name: 'Active Incidents', value: '12', icon: AlertTriangle, color: 'text-red-500' },
    { name: 'Threats Detected', value: stats.totalEntries.toLocaleString(), icon: Shield, color: 'text-blue-500' },
    { name: 'Total CVEs', value: stats.totalCves.toLocaleString(), icon: Activity, color: 'text-green-500' },
    { name: 'Active Users', value: '24', icon: Users, color: 'text-purple-500' },
  ];

  useEffect(() => {
    async function loadStats() {
      let data = await getTopStats();
      if (!data.totalEntries) {
        data = await loadInitialStats() || data;
      }
      setStats(data);
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat) => (
          <div key={stat.name} className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{stat.name}</p>
                <p className="text-2xl font-semibold mt-1">{stat.value}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ThreatStats topAsns={stats.topAsns} />
        <DomainStats topDomains={stats.topDomains} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BreachedAccounts />
        <NeonDefense />
      </div>
    </div>
  );
}