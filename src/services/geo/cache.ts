import type { GeoLocation } from '../../types';
import type { GeoDataEntry } from './types';

// In-memory cache for geo lookups
const geoCache = new Map<string, GeoLocation>();

export function getCachedLocation(ip: string): GeoLocation | undefined {
  return geoCache.get(ip);
}

export function setCachedLocation(ip: string, location: GeoLocation): void {
  geoCache.set(ip, location);
}

export function clearCache(): void {
  geoCache.clear();
}

export function convertToGeoLocation(ip: string, entry: GeoDataEntry): GeoLocation {
  return {
    ip,
    lat: entry.latitude,
    lng: entry.longitude,
    country: entry.country,
    city: entry.city,
    isMalicious: true,
    source: 'FireHOL'
  };
}