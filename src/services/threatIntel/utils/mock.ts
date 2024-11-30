import { Vulnerability } from '../../../types/threatIntel';

export const getMockVulnerabilities = (): Vulnerability[] => [
  {
    id: 'CVE-2024-0001',
    description: 'Critical vulnerability in network stack',
    severity: 'CRITICAL',
    published: new Date().toISOString(),
    references: ['https://nvd.nist.gov/vuln/detail/CVE-2024-0001']
  },
  {
    id: 'CVE-2024-0002',
    description: 'Buffer overflow in system component',
    severity: 'HIGH',
    published: new Date().toISOString(),
    references: ['https://nvd.nist.gov/vuln/detail/CVE-2024-0002']
  },
  {
    id: 'CVE-2024-0003',
    description: 'Authentication bypass vulnerability',
    severity: 'CRITICAL',
    published: new Date().toISOString(),
    references: ['https://nvd.nist.gov/vuln/detail/CVE-2024-0003']
  }
];