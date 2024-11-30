import type { GeoLocation } from '../../types';

export interface GeoDataEntry {
  latitude: number;
  longitude: number;
  country?: string;
  city?: string;
}

export interface GeoDataCache {
  [ip: string]: GeoDataEntry;
}

export interface GeoProcessOptions {
  batchSize?: number;
  logProgress?: boolean;
}