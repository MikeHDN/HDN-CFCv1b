import axios from 'axios';
import { ThreatIndicator } from '../../types/threatIntel';
import { API_CONFIG } from './config';

export const fetchFireholData = async (): Promise<ThreatIndicator[]> => {
  for (const url of API_CONFIG.FIREHOL.URLS) {
    try {
      const response = await axios.get(url);
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
      console.error(`Error fetching from ${url}:`, error);
      continue;
    }
  }
  return [];
};