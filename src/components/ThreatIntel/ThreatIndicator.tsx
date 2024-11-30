import React from 'react';
import { Shield, AlertTriangle, Network } from 'lucide-react';
import type { ThreatFeed } from '../../types';

interface Props {
  indicator: ThreatFeed;
}

export default function ThreatIndicator({ indicator }: Props) {
  const isIPRange = indicator.type === 'Malicious IP Range';

  return (
    <div className="bg-gray-700 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {indicator.severity === 'critical' ? (
            <AlertTriangle className="w-5 h-5 text-red-500" />
          ) : isIPRange ? (
            <Network className="w-5 h-5 text-blue-500" />
          ) : (
            <Shield className="w-5 h-5 text-blue-500" />
          )}
          <span className="font-medium">{indicator.source}</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${
          indicator.severity === 'critical' 
            ? 'bg-red-900 text-red-200' 
            : 'bg-orange-900 text-orange-200'
        }`}>
          {indicator.severity}
        </span>
      </div>
      
      <div className="mt-2 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Type:</span>
          <span>{indicator.type}</span>
        </div>
        
        <div className="space-y-1">
          {indicator.indicators.map((ip, index) => (
            <div key={index} className="bg-gray-800 px-3 py-2 rounded text-sm font-mono flex items-center space-x-2">
              {isIPRange && <Network className="w-4 h-4 text-blue-500" />}
              <span>{ip}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-400">
        Detected: {new Date(indicator.timestamp).toLocaleString()}
      </div>
    </div>
  );
}