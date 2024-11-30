import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Shield, AlertTriangle, RefreshCw } from 'lucide-react';
import { getThreatData } from '../services/db';
import { fetchFireholData } from '../services/threatIntel/sources';
import { lookupGeoData, validateGeoData } from '../services/geo';
import type { GeoLocation } from '../types';
import 'leaflet/dist/leaflet.css';

export default function ThreatMap() {
  const [threats, setThreats] = useState<GeoLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate geo data first
      const isGeoDataValid = await validateGeoData();
      if (!isGeoDataValid) {
        setError('Geo data is not available or invalid. Please ensure GeoLite2 data is properly loaded.');
        return;
      }

      // Get cached threat data
      const cachedThreats = await getThreatData();
      
      if (cachedThreats.length === 0) {
        // Fetch new data if cache is empty
        const { entries } = await fetchFireholData();
        if (entries?.length > 0) {
          // Take a subset of IPs to avoid overwhelming the map
          const sampleIps = entries
            .filter(e => !e.isRange)
            .slice(0, 100)
            .map(e => e.ip);
            
          const geoData = await lookupGeoData(sampleIps);
          setThreats(geoData);
        }
      } else {
        // Use cached data
        const sampleIps = cachedThreats
          .filter(t => !t.ip.includes('/'))
          .slice(0, 100)
          .map(t => t.ip);
          
        const geoData = await lookupGeoData(sampleIps);
        setThreats(geoData);
      }
    } catch (err) {
      console.error('Error loading threat map data:', err);
      setError('Failed to load threat map data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading threat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Global Threat Map</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">
            Showing {threats.length} threat locations
          </div>
          <button
            onClick={loadData}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-4 flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-200">{error}</p>
        </div>
      )}

      <div className="h-[calc(100%-4rem)] bg-gray-800 rounded-lg overflow-hidden">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          className="h-full w-full"
          style={{ background: '#1F2937' }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {threats.map((threat, index) => (
            <CircleMarker
              key={`${threat.ip}-${index}`}
              center={[threat.lat, threat.lng]}
              radius={5}
              pathOptions={{
                color: threat.isMalicious ? '#ef4444' : '#3b82f6',
                fillColor: threat.isMalicious ? '#ef4444' : '#3b82f6',
                fillOpacity: 0.6,
              }}
            >
              <Popup>
                <div className="text-gray-900">
                  <p className="font-semibold">{threat.ip}</p>
                  {threat.country && <p>Country: {threat.country}</p>}
                  {threat.city && <p>City: {threat.city}</p>}
                  <p>Source: {threat.source}</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}