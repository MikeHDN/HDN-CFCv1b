import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function ThreatFeed() {
  const threatFeeds = useStore((state) => state.threatFeeds);

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Latest Threats</h2>
      <div className="space-y-4">
        {threatFeeds.map((feed) => (
          <div
            key={feed.id}
            className="flex items-start space-x-4 p-4 bg-gray-700 rounded-lg"
          >
            {feed.severity === 'critical' ? (
              <AlertTriangle className="w-5 h-5 text-red-500" />
            ) : (
              <Shield className="w-5 h-5 text-blue-500" />
            )}
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{feed.source}</span>
                <span className="text-sm text-gray-400">{feed.timestamp}</span>
              </div>
              <p className="text-sm text-gray-300 mt-1">{feed.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}