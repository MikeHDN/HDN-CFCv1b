import type { GeoLocation } from '../../types';
import type { GeoDataEntry } from './types';
import { getCachedLocation, setCachedLocation, convertToGeoLocation } from './cache';

export async function lookupGeoData(ips: string[]): Promise<GeoLocation[]> {
  const results: GeoLocation[] = [];
  const uniqueIps = [...new Set(ips)];

  try {
    // Load the pre-processed geo data
    const response = await fetch('/data/geo_data.json');
    if (!response.ok) {
      console.warn('Geo data not found');
      return [];
    }

    const geoData: Record<string, GeoDataEntry> = await response.json();

    for (const ip of uniqueIps) {
      try {
        if (!ip || ip.includes('/')) continue;

        // Check cache first
        const cached = getCachedLocation(ip);
        if (cached) {
          results.push(cached);
          continue;
        }

        // Look up in pre-processed data
        const entry = geoData[ip];
        if (entry?.latitude && entry?.longitude) {
          const geoLocation = convertToGeoLocation(ip, entry);
          setCachedLocation(ip, geoLocation);
          results.push(geoLocation);
        }
      } catch (error) {
        console.warn(`Failed to lookup IP ${ip}:`, error);
        continue;
      }
    }
  } catch (error) {
    console.error('Failed to lookup geo data:', error);
  }

  return results;
}

export async function validateGeoData(filePath: string): Promise<boolean> {
  try {
    const response = await fetch(filePath);
    if (!response.ok) return false;
    
    const data = await response.json();
    return Object.values(data).some((entry: any) => 
      entry?.latitude && entry?.longitude
    );
  } catch {
    return false;
  }
}