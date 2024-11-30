import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  topAsns: Array<{
    asn: string;
    count: number;
    uniqueCities: number;
    totalCves: number;
    riskScore: number;
  }>;
}

export default function ThreatStats({ topAsns }: Props) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">High-Risk ASNs/Hosters</h2>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topAsns}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <XAxis type="number" />
            <YAxis
              type="category"
              dataKey="asn"
              width={90}
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
                      <p className="font-medium">{data.asn}</p>
                      <p className="text-sm text-gray-300">Risk Score: {data.riskScore.toFixed(2)}</p>
                      <p className="text-sm text-gray-300">Total CVEs: {data.totalCves}</p>
                      <p className="text-sm text-gray-300">Unique Cities: {data.uniqueCities}</p>
                      <p className="text-sm text-gray-300">Total IPs: {data.count}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="riskScore" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}