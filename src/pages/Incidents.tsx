import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Incident } from '../types';

export default function Incidents() {
  const { incidents, addIncident, updateIncident } = useStore();
  const [showNewIncidentForm, setShowNewIncidentForm] = useState(false);
  const [newIncident, setNewIncident] = useState<Partial<Incident>>({
    title: '',
    description: '',
    severity: 'medium',
    status: 'open',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const incident: Incident = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...newIncident as Omit<Incident, 'id' | 'timestamp'>,
    };
    addIncident(incident);
    setShowNewIncidentForm(false);
    setNewIncident({ title: '', description: '', severity: 'medium', status: 'open' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Incidents</h1>
        <button
          onClick={() => setShowNewIncidentForm(true)}
          className="bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Incident</span>
        </button>
      </div>

      {showNewIncidentForm && (
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={newIncident.title}
              onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={newIncident.description}
              onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white"
              rows={3}
              required
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Create Incident
            </button>
            <button
              type="button"
              onClick={() => setShowNewIncidentForm(false)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {incidents.map((incident) => (
          <div key={incident.id} className="bg-gray-800 p-6 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{incident.title}</h3>
                <p className="text-gray-400 text-sm">{new Date(incident.timestamp).toLocaleString()}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                incident.severity === 'critical' ? 'bg-red-900 text-red-200' :
                incident.severity === 'high' ? 'bg-orange-900 text-orange-200' :
                'bg-yellow-900 text-yellow-200'
              }`}>
                {incident.severity}
              </span>
            </div>
            <p className="mt-2 text-gray-300">{incident.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}