import { updateStats } from './index';
import Papa from 'papaparse';

export async function loadInitialStats() {
  try {
    // First try to load pre-processed stats
    const response = await fetch('/stats.json');
    if (response.ok) {
      const data = await response.json();
      return data;
    }

    // If no pre-processed stats, try to load and process the raw data
    const csvResponse = await fetch('/data/highrisk_with_cves.csv');
    if (csvResponse.ok) {
      const text = await csvResponse.text();
      const { data } = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        transformHeader: header => header.trim(),
        transform: value => value?.trim() || ''
      });

      const rows = data.map(row => ({
        domain: row.domain,
        addr: row.addr,
        asn: row.asn,
        cve_count: parseInt(row.cve_count) || 0
      }));

      return await updateStats(rows);
    }

    console.warn('No stats data available');
    return {
      topAsns: [],
      topDomains: [],
      totalEntries: 0,
      totalCves: 0
    };
  } catch (error) {
    console.error('Error loading initial stats:', error);
    return {
      topAsns: [],
      topDomains: [],
      totalEntries: 0,
      totalCves: 0
    };
  }
}