import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Globe, Shield } from 'lucide-react';

interface Props {
  topDomains: Array<{
    domain: string;
    cveCount: number;
    ips: string[];
    totalVulnerabilities: number;
  }>;
}

export default function DomainStats({ topDomains }: Props) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">High-Risk Domains</h2>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topDomains}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <XAxis type="number" />
            <YAxis
              type="category"
              dataKey="domain"
              width={90}
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
                      <div className="flex items-center space-x-2 mb-2">
                        <Globe className="w-4 h-4 text-blue-500" />
                        <p className="font-medium">{data.domain}</p>
                      </div>
                      <div className="space-y-1 text-sm text-gray-300">
                        <p>CVE Count: {data.cveCount}</p>
                        <p>Total Vulnerabilities: {data.totalVulnerabilities}</p>
                        <p>Associated IPs: {data.ips.length}</p>
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-700">
                        <p className="text-xs text-gray-400">Associated IPs:</p>
                        <div className="mt-1 space-y-1">
                          {data.ips.slice(0, 3).map((ip, index) => (
                            <div key={index} className="flex items-center space-x-1 text-xs">
                              <Shield className="w-3 h-3 text-blue-500" />
                              <span>{ip}</span>
                            </div>
                          ))}
                          {data.ips.length > 3 && (
                            <p className="text-xs text-gray-400">
                              +{data.ips.length - 3} more...
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="cveCount" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}