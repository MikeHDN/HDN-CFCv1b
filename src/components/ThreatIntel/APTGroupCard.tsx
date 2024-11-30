import React from 'react';
import { Shield, Globe, Calendar, Target } from 'lucide-react';
import type { APTGroup } from '../../types/threatIntel';

interface Props {
  group: APTGroup;
  onClick?: () => void;
}

export default function APTGroupCard({ group, onClick }: Props) {
  return (
    <div 
      className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <Shield className="w-5 h-5 text-red-500" />
          <h3 className="font-medium">{group.name}</h3>
        </div>
        {group.country && (
          <div className="flex items-center space-x-2 text-sm">
            <Globe className="w-4 h-4" />
            <span>{group.country}</span>
          </div>
        )}
      </div>

      <p className="text-sm text-gray-300 mb-3">{group.description}</p>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-400">First Seen</p>
          <p className="font-medium">{group.firstSeen}</p>
        </div>
        <div>
          <p className="text-gray-400">Last Seen</p>
          <p className="font-medium">{group.lastSeen}</p>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-sm text-gray-400 mb-1">Aliases</p>
        <div className="flex flex-wrap gap-2">
          {group.aliases.map((alias, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-800 rounded-lg text-xs"
            >
              {alias}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-3">
        <p className="text-sm text-gray-400 mb-1">Primary Targets</p>
        <div className="flex flex-wrap gap-2">
          {group.targets.slice(0, 3).map((target, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-gray-800 rounded-lg text-xs flex items-center space-x-1"
            >
              <Target className="w-3 h-3" />
              <span>{target}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}