import axios from 'axios';
import { storeThreatData } from '../db';
import type { ThreatFeed } from '../../types';

export async function fetchFireholData() {
  try {
    // First try to load from local netset file
    try {
      const response = await fetch('/data/firehol_level1.netset');
      if (response.ok) {
        const text = await response.text();
        const entries = [];
        const feeds: ThreatFeed[] = [];
        
        const lines = text.split('\n');
        const validEntries = lines
          .filter(line => line && !line.startsWith('#'))
          .map(line => {
            const ip = line.trim();
            return {
              ip,
              isRange: ip.includes('/'),
              isMalicious: true
            };
          });

        // Create individual feed entries for each IP/range
        validEntries.forEach(entry => {
          feeds.push({
            id: crypto.randomUUID(),
            source: 'FireHOL',
            type: entry.isRange ? 'Malicious IP Range' : 'Malicious IP',
            indicators: [entry.ip],
            timestamp: new Date().toISOString(),
            severity: 'high'
          });
        });

        await storeThreatData(validEntries);
        return { entries: validEntries, feeds };
      }
    } catch (localError) {
      console.warn('Failed to load local FireHOL data:', localError);
    }

    // Fallback to remote fetching
    const response = await axios.get('https://iplists.firehol.org/files/firehol_level1.netset', {
      timeout: 5000,
      headers: {
        'Accept': 'text/plain',
        'User-Agent': 'HDN-CFC-Platform/1.0'
      }
    });

    if (response.status === 200) {
      const entries = [];
      const feeds: ThreatFeed[] = [];
      
      const lines = response.data.toString().split('\n');
      const validEntries = lines
        .filter(line => line && !line.startsWith('#'))
        .map(line => {
          const ip = line.trim();
          return {
            ip,
            isRange: ip.includes('/'),
            isMalicious: true
          };
        });

      // Create individual feed entries for each IP/range
      validEntries.forEach(entry => {
        feeds.push({
          id: crypto.randomUUID(),
          source: 'FireHOL',
          type: entry.isRange ? 'Malicious IP Range' : 'Malicious IP',
          indicators: [entry.ip],
          timestamp: new Date().toISOString(),
          severity: 'high'
        });
      });

      await storeThreatData(validEntries);
      return { entries: validEntries, feeds };
    }

    return { entries: [], feeds: [] };
  } catch (error) {
    console.error('Error in fetchFireholData:', error);
    return { entries: [], feeds: [] };
  }
}

export async function fetchExploitDBData() {
  try {
    const response = await axios.get('https://raw.githubusercontent.com/offensive-security/exploitdb/master/files_exploits.csv', {
      timeout: 5000,
      headers: {
        'Accept': 'text/plain',
        'User-Agent': 'HDN-CFC-Platform/1.0'
      }
    });

    if (response.status === 200) {
      const lines = response.data.toString().split('\n');
      const exploits = lines.slice(1)
        .filter(Boolean)
        .map(line => {
          try {
            const [id, file, description, date, author, platform, type] = line.split(',').map(s => s.trim());
            return {
              id: id || '',
              file: file || '',
              description: description || '',
              date: date || new Date().toISOString(),
              author: author || 'Unknown',
              platform: platform || 'Unknown',
              type: type || 'Unknown',
              source: 'ExploitDB'
            };
          } catch (parseError) {
            return null;
          }
        })
        .filter(Boolean);

      const feeds = exploits.slice(0, 10).map(exploit => ({
        id: crypto.randomUUID(),
        source: 'ExploitDB',
        type: 'Exploit',
        indicators: [exploit.file],
        timestamp: exploit.date || new Date().toISOString(),
        severity: 'critical',
        description: exploit.description
      }));

      return { exploits, feeds };
    }
    return { exploits: [], feeds: [] };
  } catch (error) {
    console.error('Error in fetchExploitDBData:', error);
    return { exploits: [], feeds: [] };
  }
}