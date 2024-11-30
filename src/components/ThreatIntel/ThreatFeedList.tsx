import React from 'react';
import { Shield } from 'lucide-react';
import ThreatFeedCard from './ThreatFeedCard';
import type { ThreatFeed } from '../../types';

interface Props {
  feeds: ThreatFeed[];
}

export default function ThreatFeedList({ feeds }: Props) {
  if (feeds.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <Shield className="w-12 h-12 mx-auto mb-4 text-gray-500" />
        <p>No threat indicators available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {feeds.map((feed) => (
        <ThreatFeedCard key={feed.id} feed={feed} />
      ))}
    </div>
  );
}