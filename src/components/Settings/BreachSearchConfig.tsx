import React, { useState, useEffect } from 'react';
import { Folder, Plus, Trash2 } from 'lucide-react';
import { getSearchSettings, updateSearchSettings } from '../../services/breachService';

export default function BreachSearchConfig() {
  const [searchPaths, setSearchPaths] = useState<string[]>([]);
  const [targetDomains, setTargetDomains] = useState<string[]>([]);
  const [newPath, setNewPath] = useState('');
  const [newDomain, setNewDomain] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await getSearchSettings();
      setSearchPaths(settings.searchPaths);
      setTargetDomains(settings.targetDomains);
    } catch (err) {
      setError('Failed to load settings');
    }
  };

  const handleAddPath = () => {
    if (!newPath) return;
    setSearchPaths([...searchPaths, newPath]);
    setNewPath('');
    saveSettings([...searchPaths, newPath], targetDomains);
  };

  const handleAddDomain = () => {
    if (!newDomain) return;
    setTargetDomains([...targetDomains, newDomain]);
    setNewDomain('');
    saveSettings(searchPaths, [...targetDomains, newDomain]);
  };

  const handleRemovePath = (index: number) => {
    const newPaths = searchPaths.filter((_, i) => i !== index);
    setSearchPaths(newPaths);
    saveSettings(newPaths, targetDomains);
  };

  const handleRemoveDomain = (index: number) => {
    const newDomains = targetDomains.filter((_, i) => i !== index);
    setTargetDomains(newDomains);
    saveSettings(searchPaths, newDomains);
  };

  const saveSettings = async (paths: string[], domains: string[]) => {
    try {
      await updateSearchSettings(paths, domains);
      setError(null);
    } catch (err) {
      setError('Failed to save settings');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Search Paths</h3>
        <div className="space-y-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={newPath}
              onChange={(e) => setNewPath(e.target.value)}
              placeholder="Add search path..."
              className="flex-1 bg-gray-800 rounded-lg px-4 py-2"
            />
            <button
              onClick={handleAddPath}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
          
          <div className="space-y-2">
            {searchPaths.map((path, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-800 p-3 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Folder className="w-5 h-5 text-blue-500" />
                  <span>{path}</span>
                </div>
                <button
                  onClick={() => handleRemovePath(index)}
                  className="p-1 hover:bg-gray-700 rounded-lg text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Target Domains</h3>
        <div className="space-y-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              placeholder="Add domain (e.g., example.com)..."
              className="flex-1 bg-gray-800 rounded-lg px-4 py-2"
            />
            <button
              onClick={handleAddDomain}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
          
          <div className="space-y-2">
            {targetDomains.map((domain, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-800 p-3 rounded-lg"
              >
                <span>{domain}</span>
                <button
                  onClick={() => handleRemoveDomain(index)}
                  className="p-1 hover:bg-gray-700 rounded-lg text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 text-red-200">
          {error}
        </div>
      )}
    </div>
  );
}