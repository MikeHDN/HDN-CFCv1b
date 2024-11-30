import { Vulnerability } from '../../../types/threatIntel';

interface Cache {
  vulnerabilities: { [year: number]: Vulnerability[] };
  lastUpdate: string | null;
}

const cache: Cache = {
  vulnerabilities: {},
  lastUpdate: null
};

export const getCachedVulnerabilities = (year: number): Vulnerability[] | null => {
  return cache.vulnerabilities[year] || null;
};

export const setCachedVulnerabilities = (year: number, data: Vulnerability[]): void => {
  cache.vulnerabilities[year] = data;
  cache.lastUpdate = new Date().toISOString();
};

export const getLastUpdateTime = (): string | null => {
  return cache.lastUpdate;
};

export const clearCache = (): void => {
  cache.vulnerabilities = {};
  cache.lastUpdate = null;
};