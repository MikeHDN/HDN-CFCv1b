import type { Vulnerability } from '../../types/threatIntel';
import { getCachedVulnerabilities, setCachedVulnerabilities, getLastUpdateTime } from './cache';
import { getMockVulnerabilities } from './mock';

export const fetchVulnerabilities = async (year: number): Promise<Vulnerability[]> => {
  try {
    // Check cache first
    const cached = getCachedVulnerabilities(year);
    if (cached) {
      return cached;
    }

    // In a real application, this would make an API call
    // For demo purposes, we'll use mock data
    const vulnerabilities = getMockVulnerabilities();
    
    // Cache the results
    setCachedVulnerabilities(year, vulnerabilities);
    
    return vulnerabilities;
  } catch (error) {
    console.error('Error fetching vulnerabilities:', error);
    return [];
  }
};

export { getLastUpdateTime };