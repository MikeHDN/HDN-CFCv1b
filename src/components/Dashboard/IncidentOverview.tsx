import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useStore } from '../../store/useStore';

export default function IncidentOverview() {
  const incidents = useStore((state) => state.incidents);

  const data = [
    { name: 'Critical', value: incidents.filter((i) => i.severity === 'critical').length },
    { name: 'High', value: incidents.filter((i) => i.severity === 'high').length },
    { name: 'Medium', value: incidents.filter((i) => i.severity === 'medium').length },
    { name: 'Low', value: incidents.filter((i) => i.severity === 'low').length },
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Incident Overview</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip />
            <Bar dataKey="value" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}