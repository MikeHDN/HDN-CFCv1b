import React, { useEffect, useState } from 'react';
import { Shield, ExternalLink, RefreshCw, AlertTriangle, Users, Activity } from 'lucide-react';
import { fetchAllIndicators } from '../services/threatIntel/indicators';
import { getAPTGroups, getAPTActivities } from '../services/threatIntel/aptGroups';
import type { ThreatFeed, APTGroup, APTActivity } from '../types/threatIntel';
import IndicatorsList from '../components/ThreatIntel/IndicatorsList';
import APTGroupCard from '../components/ThreatIntel/APTGroupCard';

export default function ThreatIntel() {
  const [indicators, setIndicators] = useState<ThreatFeed[]>([]);
  const [aptGroups, setAptGroups] = useState<APTGroup[]>([]);
  const [aptActivities, setAptActivities] = useState<APTActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [threatIndicators, groups, activities] = await Promise.all([
        fetchAllIndicators(),
        getAPTGroups(),
        getAPTActivities()
      ]);

      setIndicators(threatIndicators);
      setAptGroups(groups);
      setAptActivities(activities);
    } catch (err) {
      setError('Failed to fetch threat intelligence data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Threat Intelligence</h1>
        <button
          onClick={fetchData}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Updating...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5" />
              <span>Refresh Data</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-200">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="w-6 h-6 text-red-500" />
              <h2 className="text-xl font-semibold">APT Groups</h2>
            </div>
            <div className="space-y-4">
              {aptGroups.map((group) => (
                <APTGroupCard key={group.id} group={group} />
              ))}
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <Activity className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-semibold">Recent APT Activities</h2>
            </div>
            <div className="space-y-4">
              {aptActivities.map((activity) => (
                <div key={activity.id} className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{activity.name}</span>
                    <span className="text-sm text-gray-400">
                      {new Date(activity.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{activity.description}</p>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-gray-800 rounded-lg text-xs">
                      {activity.type}
                    </span>
                    {activity.indicators.map((indicator, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-800 rounded-lg text-xs">
                        {indicator.indicator}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Latest Indicators</h2>
            <IndicatorsList indicators={indicators} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}