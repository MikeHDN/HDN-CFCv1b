import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import type { ThreatFeed } from '../../types';

interface Props {
  feed: ThreatFeed;
}

export default function ThreatFeedCard({ feed }: Props) {
  return (
    <div className="bg-gray-700 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {feed.severity === 'critical' ? (
            <AlertTriangle className="w-5 h-5 text-red-500" />
          ) : (
            <Shield className="w-5 h-5 text-blue-500" />
          )}
          <span className="font-medium">{feed.source}</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${
          feed.severity === 'critical' ? 'bg-red-900 text-red-200' : 'bg-orange-900 text-orange-200'
        }`}>
          {feed.severity}
        </span>
      </div>
      
      <p className="text-sm text-gray-300">{feed.type}</p>
      
      {feed.description && (
        <p className="text-sm text-gray-400 mt-1">{feed.description}</p>
      )}
      
      <div className="mt-2 space-y-1">
        {feed.indicators.filter(Boolean).map((indicator, index) => (
          <div 
            key={index} 
            className="bg-gray-600 px-3 py-2 rounded-lg text-sm font-mono"
            title={`Malicious IP from ${feed.source}`}
          >
            {indicator}
          </div>
        ))}
      </div>
      
      <p className="text-xs text-gray-400 mt-2">
        {new Date(feed.timestamp).toLocaleString()}
      </p>
    </div>
  );
}