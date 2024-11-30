import React, { useState, useEffect } from 'react';
import { AlertTriangle, Search, RefreshCw } from 'lucide-react';
import { searchBreaches } from '../../services/breachService';

export default function BreachedAccounts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [breaches, setBreaches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchTerm) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const results = await searchBreaches(searchTerm);
      setBreaches(results);
    } catch (err) {
      setError('Failed to search for breaches');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Breached Accounts</h2>
      
      <div className="flex space-x-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search email or domain..."
            className="w-full bg-gray-700 rounded-lg pl-10 pr-4 py-2"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
        >
          {loading ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
          <span>Search</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-4 flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-200">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {breaches.map((breach, index) => (
          <div key={index} className="bg-gray-700 p-4 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{breach.source}</h3>
                <p className="text-sm text-gray-400 mt-1">{breach.date}</p>
              </div>
              <span className="px-3 py-1 bg-red-900/50 text-red-200 rounded-full text-sm">
                {breach.type}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-300">{breach.description}</p>
            {breach.affectedData && (
              <div className="mt-2">
                <p className="text-sm text-gray-400">Affected Data:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {breach.affectedData.map((data: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-gray-600 rounded-lg text-xs"
                    >
                      {data}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}