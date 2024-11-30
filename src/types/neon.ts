export interface SystemInfo {
  hostname: string;
  os: string;
  ip: string;
  lastUpdate: string;
  openPorts?: number[];
  version?: string;
}

export interface NetworkDevice extends SystemInfo {
  type?: 'server' | 'client';
  department?: string;
}

export interface Vulnerability {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  discovered: string;
  cve?: string;
  breachProbability?: number;
}

export interface VulnerabilityScan extends SystemInfo {
  vulnerabilities: Vulnerability[];
  riskScore: number;
  breachProbability: number;
}