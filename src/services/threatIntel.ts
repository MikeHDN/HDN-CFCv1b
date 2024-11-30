import axios from 'axios';
import { format } from 'date-fns';
import type { ThreatIndicator, ExploitData, Vulnerability } from '../types';

// Firehol Data
const FIREHOL_URL = 'https://iplists.firehol.org/files/firehol_level1.netset';

export const fetchFireholData = async (): Promise<ThreatIndicator[]> => {
  try {
    const response = await axios.get(FIREHOL_URL);
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
    console.error('Error fetching Firehol data:', error);
    return [];
  }
};

// ExploitDB Data
const EXPLOITDB_URL = 'https://raw.githubusercontent.com/offensive-security/exploitdb/master/files_exploits.csv';

export const fetchExploitDBData = async (): Promise<ExploitData[]> => {
  try {
    const response = await axios.get(EXPLOITDB_URL);
    return response.data
      .split('\n')
      .slice(1)
      .filter(Boolean)
      .map((line: string) => {
        const [id, file, description, date, author, platform, type] = line.split(',');
        return {
          id,
          file,
          description,
          date,
          author,
          platform,
          type,
          source: 'ExploitDB'
        };
      });
  } catch (error) {
    console.error('Error fetching ExploitDB data:', error);
    return [];
  }
};

// Vulnerabilities
const NIST_API_BASE = 'https://services.nvd.nist.gov/rest/json/cves/2.0';

export const fetchVulnerabilities = async (year: number): Promise<Vulnerability[]> => {
  const startDate = format(new Date(year, 0, 1), "yyyy-MM-dd'T'HH:mm:ss.SSS");
  const endDate = format(new Date(year, 11, 31), "yyyy-MM-dd'T'HH:mm:ss.SSS");
  
  try {
    const response = await axios.get(NIST_API_BASE, {
      params: {
        pubStartDate: startDate,
        pubEndDate: endDate
      }
    });

    if (!response.data?.vulnerabilities) {
      return [];
    }

    return response.data.vulnerabilities.map((vuln: any) => ({
      id: vuln.cve?.id || 'Unknown',
      description: vuln.cve?.descriptions?.[0]?.value || 'No description available',
      severity: vuln.cve?.metrics?.cvssMetricV31?.[0]?.cvssData?.baseSeverity || 'UNKNOWN',
      published: vuln.cve?.published || new Date().toISOString(),
      references: vuln.cve?.references?.map((ref: any) => ref.url) || []
    }));
  } catch (error) {
    console.error('Error fetching vulnerabilities:', error);
    return [];
  }
};