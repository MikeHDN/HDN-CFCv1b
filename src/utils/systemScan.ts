interface Vulnerability {
  id: string;
  severity: string;
  description: string;
}

interface ScanResult {
  hostname: string;
  os: string;
  vulnerabilities: Vulnerability[];
}

// Simulate system scan with realistic data
export async function simulateSystemScan(): Promise<ScanResult[]> {
  const vulnerabilities: Vulnerability[] = [
    {
      id: 'HDN-CVE-2024-001',
      severity: 'critical',
      description: 'Remote Code Execution vulnerability in web server'
    },
    {
      id: 'HDN-CVE-2024-002',
      severity: 'high',
      description: 'SQL Injection vulnerability in database service'
    },
    {
      id: 'HDN-CVE-2024-003',
      severity: 'medium',
      description: 'Cross-Site Scripting vulnerability in web application'
    }
  ];

  const results: ScanResult[] = [
    {
      hostname: 'localhost',
      os: detectOS(),
      vulnerabilities
    }
  ];

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return results;
}

function detectOS(): string {
  const userAgent = window.navigator.userAgent.toLowerCase();
  
  if (userAgent.includes('win')) return 'Windows';
  if (userAgent.includes('mac')) return 'macOS';
  if (userAgent.includes('linux')) return 'Linux';
  
  return 'Unknown OS';
}