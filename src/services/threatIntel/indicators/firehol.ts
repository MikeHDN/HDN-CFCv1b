import type { ThreatFeed } from '../../../types';
import { readLocalFile } from '../../utils/file';

export async function fetchFireholIndicators(): Promise<ThreatFeed[]> {
  try {
    const text = await readLocalFile('/data/firehol_level1.netset');
    if (!text) return [];

    const feeds: ThreatFeed[] = [];
    const lines = text.split('\n');
    
    const validEntries = lines
      .filter(line => line && !line.startsWith('#'))
      .map(line => line.trim())
      .filter(Boolean);

    // Create feed entries in batches of 5 IPs
    for (let i = 0; i < validEntries.length; i += 5) {
      const batch = validEntries.slice(i, i + 5);
      feeds.push({
        id: crypto.randomUUID(),
        source: 'FireHOL',
        type: batch.some(ip => ip.includes('/')) ? 'Malicious IP Range' : 'Malicious IP',
        indicators: batch,
        timestamp: new Date().toISOString(),
        severity: 'high'
      });
    }

    return feeds;
  } catch (error) {
    console.error('Error fetching FireHOL data:', error);
    return [];
  }
}