import type { ThreatIndicator } from '../../types/threatIntel';
import { API_CONFIG } from './config';
import { fetchWithRetry } from './utils/network';

export class ThreatDataService {
  static async fetchThreatData(): Promise<ThreatIndicator[]> {
    try {
      const response = await fetchWithRetry(API_CONFIG.FIREHOL.URLS[0]);
      return response.data
        .split('\n')
        .filter((line: string) => !line.startsWith('#') && line.trim())
        .map((ip: string) => ({
          indicator: ip.trim(),
          type: 'IP',
          source: 'Firehol',
          confidence: 'high',
          lastUpdated: new Date().toISOString()
        }));
    } catch (error) {
      console.error('Error fetching threat data:', error);
      return [];
    }
  }
}