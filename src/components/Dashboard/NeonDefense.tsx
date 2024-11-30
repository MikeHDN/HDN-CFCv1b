import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Server, Laptop } from 'lucide-react';
import { scanSystem, analyzeVulnerabilities } from '../../services/neonService';

interface ScanResult {
  type: 'server' | 'client';
  hostname: string;
  os: string;
  vulnerabilities: number;
  riskScore: number;
  details: Array<{
    id: string;
    severity: string;
    description: string;
    probability: number;
  }>;
}

export default function NeonDefense() {
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    setScanning(true);
    setError(null);
    
    try {
      const scanResults = await scanSystem();
      const analyzedResults = await analyzeVulnerabilities(scanResults);
      setResults(analyzedResults);
    } catch (err) {
      setError('Failed to complete system scan');
      console.error(err);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">HDN-NEON Cyber Defense</h2>
          <p className="text-sm text-gray-400 mt-1">
            AI-powered vulnerability assessment
          </p>
        </div>
        <button
          onClick={handleScan}
          disabled={scanning}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
        >
          {scanning ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              <span>Scanning...</span>
            </>
          ) : (
            <>
              <Shield className="w-5 h-5" />
              <span>Start Scan</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-4 flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-200">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {results.map((result, index) => (
          <div key={index} className="bg-gray-700 p-4 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                {result.type === 'server' ? (
                  <Server className="w-5 h-5 text-blue-500" />
                ) : (
                  <Laptop className="w-5 h-5 text-green-500" />
                )}
                <div>
                  <h3 className="font-medium">{result.hostname}</h3>
                  <p className="text-sm text-gray-400">{result.os}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">Risk Score</div>
                <div
                  className={`text-lg font-bold ${
                    result.riskScore > 7
                      ? 'text-red-500'
                      : result.riskScore > 4
                      ? 'text-yellow-500'
                      : 'text-green-500'
                  }`}
                >
                  {result.riskScore.toFixed(1)}
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {result.details.map((vuln, i) => (
                <div key={i} className="bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{vuln.id}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        vuln.severity === 'critical'
                          ? 'bg-red-900/50 text-red-200'
                          : vuln.severity === 'high'
                          ? 'bg-orange-900/50 text-orange-200'
                          : 'bg-yellow-900/50 text-yellow-200'
                      }`}
                    >
                      {vuln.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">{vuln.description}</p>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-gray-400">Breach Probability:</span>
                    <span className="font-medium">
                      {(vuln.probability * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}