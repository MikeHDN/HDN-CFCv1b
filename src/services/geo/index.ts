import type { GeoLocation } from '../../types';
import { readLocalFile } from '../utils/file';

interface GeoData {
  [ip: string]: {
    latitude: number;
    longitude: number;
    country?: string;
    city?: string;
  };
}

const geoCache = new Map<string, GeoLocation>();

export async function lookupGeoData(ips: string[]): Promise<GeoLocation[]> {
  try {
    const uniqueIps = [...new Set(ips)].filter(ip => !ip.includes('/'));
    const results: GeoLocation[] = [];

    // Try to load pre-processed geo data first
    let text = await readLocalFile('/data/geo_data.json');
    
    // If no pre-processed data, try to load from GeoLite2 data
    if (!text) {
      text = await readLocalFile('/data/GeoLite2-City.mmdb');
      if (!text) {
        console.warn('No geo data available');
        return [];
      }
    }

    let geoData: GeoData;
    try {
      geoData = JSON.parse(text);
    } catch (parseError) {
      console.error('Error parsing geo data:', parseError);
      return [];
    }

    for (const ip of uniqueIps) {
      // Check cache first
      const cached = geoCache.get(ip);
      if (cached) {
        results.push(cached);
        continue;
      }

      // Look up in geo data
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
    }

    return results;
  } catch (error) {
    console.error('Error looking up geo data:', error);
    return [];
  }
}

export async function validateGeoData(): Promise<boolean> {
  try {
    const text = await readLocalFile('/data/geo_data.json');
    if (!text) return false;

    const data = JSON.parse(text);
    return Object.values(data).some((entry: any) => 
      entry?.latitude && entry?.longitude
    );
  } catch {
    return false;
  }
}