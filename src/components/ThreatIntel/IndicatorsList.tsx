import React from 'react';
import { Shield } from 'lucide-react';
import ThreatIndicator from './ThreatIndicator';
import type { ThreatFeed } from '../../types';

interface Props {
  indicators: ThreatFeed[];
  loading: boolean;
}

export default function IndicatorsList({ indicators, loading }: Props) {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Loading threat indicators...</p>
      </div>
    );
  }

  if (indicators.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <Shield className="w-12 h-12 mx-auto mb-4 text-gray-500" />
        <p>No threat indicators available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {indicators.map((indicator) => (
        <ThreatIndicator key={indicator.id} indicator={indicator} />
      ))}
    </div>
  );
}