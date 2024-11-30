import axios from 'axios';
import { ThreatIndicator, ExploitData } from '../../../types/threatIntel';
import { API_CONFIG } from '../config';

export const fetchThreatData = async (): Promise<ThreatIndicator[]> => {
  try {
    const response = await axios.get(API_CONFIG.FIREHOL.URLS[0]);
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
};

export const fetchExploits = async (): Promise<ExploitData[]> => {
  try {
    const response = await axios.get(API_CONFIG.EXPLOITDB.URL);
    return response.data
      .split('\n')
      .slice(1)
      .filter(Boolean)
      .map((line: string) => {
        const [id, file, description, date, author, platform, type] = line.split(',');
        return { id, file, description, date, author, platform, type, source: 'ExploitDB' };
      });
  } catch (error) {
    console.error('Error fetching exploits:', error);
    return [];
  }
};

export default {
  fetchThreatData,
  fetchExploits
};