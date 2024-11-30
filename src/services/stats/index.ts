import { openDB } from 'idb';
import Papa from 'papaparse';

interface ThreatEntry {
  domain: string;
  addr: string;
  asn: string;
  cve_count: number;
}

interface StatsDB {
  topAsns: Array<{ asn: string; count: number; uniqueCities: number; totalCves: number; riskScore: number }>;
  topDomains: Array<{ domain: string; cveCount: number; ips: string[]; totalVulnerabilities: number }>;
  totalEntries: number;
  totalCves: number;
}

async function initDB() {
  return openDB('hdn-stats-db', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('stats')) {
        db.createObjectStore('stats');
      }
    },
  });
}

export async function getTopStats(): Promise<StatsDB> {
  try {
    const db = await initDB();
    const stats = await db.get('stats', 'current');
    
    if (!stats) {
      return {
        topAsns: [],
        topDomains: [],
        totalEntries: 0,
        totalCves: 0
      };
    }

    return stats;
  } catch (error) {
    console.error('Error getting stats:', error);
    return {
      topAsns: [],
      topDomains: [],
      totalEntries: 0,
      totalCves: 0
    };
  }
}

export async function updateStats(data: ThreatEntry[]) {
  try {
    // Group by ASN and collect data
    const asnStats = data.reduce((acc, entry) => {
      if (!acc[entry.asn]) {
        acc[entry.asn] = {
          count: 0,
          cities: new Set(),
          totalCves: 0
        };
      }
      acc[entry.asn].count++;
      acc[entry.asn].cities.add(entry.domain);
      acc[entry.asn].totalCves += entry.cve_count;
      return acc;
    }, {} as Record<string, { count: number; cities: Set<string>; totalCves: number }>);

    // Group by domain and collect IPs and vulnerabilities
    const domainStats = data.reduce((acc, entry) => {
      if (!acc[entry.domain]) {
        acc[entry.domain] = {
          ips: new Set(),
          cveCount: 0,
          totalVulnerabilities: 0
        };
      }
      acc[entry.domain].ips.add(entry.addr);
      acc[entry.domain].cveCount += entry.cve_count;
      acc[entry.domain].totalVulnerabilities++;
      return acc;
    }, {} as Record<string, { ips: Set<string>; cveCount: number; totalVulnerabilities: number }>);

    // Calculate risk scores and sort ASNs
    const topAsns = Object.entries(asnStats)
      .map(([asn, stats]) => ({
        asn,
        count: stats.count,
        uniqueCities: stats.cities.size,
        totalCves: stats.totalCves,
        riskScore: (stats.totalCves * 0.6) + (stats.count * 0.4)
      }))
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 20);

    // Sort and get top domains with associated IPs
    const topDomains = Object.entries(domainStats)
      .map(([domain, stats]) => ({
        domain,
        cveCount: stats.cveCount,
        ips: Array.from(stats.ips),
        totalVulnerabilities: stats.totalVulnerabilities
      }))
      .sort((a, b) => b.cveCount - a.cveCount)
      .slice(0, 20);

    const stats = {
      topAsns,
      topDomains,
      totalEntries: data.length,
      totalCves: data.reduce((sum, entry) => sum + entry.cve_count, 0)
    };

    const db = await initDB();
    await db.put('stats', stats, 'current');

    return stats;
  } catch (error) {
    console.error('Error updating stats:', error);
    throw error;
  }
}