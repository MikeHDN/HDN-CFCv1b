import axios from 'axios';
import { storeThreatData } from '../db';

const FIREHOL_URLS = [
  'https://raw.githubusercontent.com/firehol/blocklist-ipsets/master/firehol_level1.netset',
  'https://raw.githubusercontent.com/firehol/blocklist-ipsets/master/firehol_level2.netset'
];

export async function fetchFireholData() {
  try {
    const entries: any[] = [];
    
    for (const url of FIREHOL_URLS) {
      const response = await axios.get(url);
      if (response.status === 200) {
        const lines = response.data.split('\n');
        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine && !trimmedLine.startsWith('#')) {
            entries.push({
              ip: trimmedLine,
              isRange: trimmedLine.includes('/'),
              isMalicious: true
            });
          }
        }
      }
    }

    await storeThreatData(entries);
    return entries;
  } catch (error) {
    console.error('Error fetching Firehol data:', error);
    throw error;
  }
}