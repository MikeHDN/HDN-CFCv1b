import React, { useState } from 'react';
import { Globe, Plus, Trash2, RefreshCw } from 'lucide-react';

interface ThreatSource {
  id: string;
  name: string;
  url: string;
  type: 'ip' | 'exploit' | 'vulnerability';
  enabled: boolean;
}

export default function ThreatIntelSources() {
  const [sources, setSources] = useState<ThreatSource[]>([
    {
      id: 'firehol1',
      name: 'FireHOL Level 1',
      url: 'https://iplists.firehol.org/files/firehol_level1.netset',
      type: 'ip',
      enabled: true
    },
    {
      id: 'emerging',
      name: 'Emerging Threats',
      url: 'http://rules.emergingthreats.net/fwrules/emerging-Block-IPs.txt',
      type: 'ip',
      enabled: true
    },
    {
      id: 'exploitdb',
      name: 'ExploitDB',
      url: 'https://gitlab.com/api/v4/projects/exploit-database%2Fexploitdb/repository/files/files_exploits.csv/raw',
      type: 'exploit',
      enabled: true
    }
  ]);

  const [newSource, setNewSource] = useState<Partial<ThreatSource>>({
    name: '',
    url: '',
    type: 'ip',
    enabled: true
  });

  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddSource = () => {
    if (!newSource.name || !newSource.url) {
      setError('Name and URL are required');
      return;
    }

    setSources([...sources, {
      id: crypto.randomUUID(),
      name: newSource.name,
      url: newSource.url,
      type: newSource.type || 'ip',
      enabled: true
    }]);

    setNewSource({ name: '', url: '', type: 'ip', enabled: true });
    setError(null);
  };

  const handleRemoveSource = (id: string) => {
    setSources(sources.filter(source => source.id !== id));
  };

  const handleToggleSource = (id: string) => {
    setSources(sources.map(source => 
      source.id === id ? { ...source, enabled: !source.enabled } : source
    ));
  };

  const handleUpdateSources = async () => {
    setUpdating(true);
    setError(null);

    try {
      await Promise.all(sources
        .filter(source => source.enabled)
        .map(source => fetch(source.url))
      );
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      setError('Failed to update threat intelligence data');
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Threat Intelligence Sources</h3>
        <button
          onClick={handleUpdateSources}
          disabled={updating}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
        >
          {updating ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          <span>Update All</span>
        </button>
      </div>

      <div className="bg-gray-700 p-4 rounded-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Source Name"
            value={newSource.name}
            onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
            className="bg-gray-800 rounded-lg px-4 py-2"
          />
          <input
            type="url"
            placeholder="Source URL"
            value={newSource.url}
            onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
            className="md:col-span-2 bg-gray-800 rounded-lg px-4 py-2"
          />
          <select
            value={newSource.type}
            onChange={(e) => setNewSource({ ...newSource, type: e.target.value as any })}
            className="bg-gray-800 rounded-lg px-4 py-2"
          >
            <option value="ip">IP List</option>
            <option value="exploit">Exploit</option>
            <option value="vulnerability">Vulnerability</option>
          </select>
        </div>
        <button
          onClick={handleAddSource}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Source</span>
        </button>
      </div>

      <div className="space-y-4">
        {sources.map((source) => (
          <div
            key={source.id}
            className="bg-gray-700 p-4 rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <Globe className="w-5 h-5 text-blue-500" />
              <div>
                <h4 className="font-medium">{source.name}</h4>
                <p className="text-sm text-gray-400">{source.url}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                {source.type}
              </span>
              <button
                onClick={() => handleToggleSource(source.id)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  source.enabled ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white ${
                    source.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <button
                onClick={() => handleRemoveSource(source.id)}
                className="p-2 hover:bg-gray-600 rounded-lg text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 text-red-200">
          {error}
        </div>
      )}
    </div>
  );
}