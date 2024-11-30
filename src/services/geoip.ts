import type { GeoLocation } from '../types';

// Use a simple cache to store geo results
const geoCache = new Map<string, GeoLocation>();

export async function lookupGeoData(ips: string[]): Promise<GeoLocation[]> {
  const results: GeoLocation[] = [];
  const uniqueIps = [...new Set(ips)];

  try {
    // Load the pre-processed geo data
    const response = await fetch('/data/geo_data.json');
    if (!response.ok) {
      console.warn('Geo data not found, using empty cache');
      return [];
    }

    const geoData = await response.json();

    for (const ip of uniqueIps) {
      try {
        if (!ip || ip.includes('/')) continue;

        // Check cache first
        if (geoCache.has(ip)) {
          results.push(geoCache.get(ip)!);
          continue;
        }

        // Look up in pre-processed data
        const location = geoData[ip];
        if (location?.latitude && location?.longitude) {
          const geoLocation: GeoLocation = {
            ip,
            lat: location.latitude,
            lng: location.longitude,
            country: location.country,
            city: location.city,
            isMalicious: true,
            source: 'FireHOL'
          };

          geoCache.set(ip, geoLocation);
          results.push(geoLocation);
        }
      } catch (error) {
        console.warn(`Failed to lookup IP ${ip}:`, error);
        continue;
      }
    }
  } catch (error) {
    console.error('Error loading geo data:', error);
  }

  return results;
}