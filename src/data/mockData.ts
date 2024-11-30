import { Incident, ThreatFeed } from '../types';

export const mockIncidents: Incident[] = [
  {
    id: '1',
    title: 'Suspicious Network Activity',
    severity: 'high',
    status: 'investigating',
    timestamp: new Date().toISOString(),
    description: 'Multiple failed login attempts detected from IP range 192.168.1.0/24',
    assignedTo: 'analyst1',
  },
  {
    id: '2',
    title: 'Malware Detection',
    severity: 'critical',
    status: 'open',
    timestamp: new Date().toISOString(),
    description: 'Ransomware signature detected on workstation WS-001',
    assignedTo: 'analyst2',
  },
];

export const mockThreatFeeds: ThreatFeed[] = [
  {
    id: '1',
    source: 'AlienVault OTX',
    type: 'Malicious IP',
    indicators: ['45.123.45.67', '89.234.123.45'],
    timestamp: new Date().toISOString(),
    severity: 'high',
  },
  {
    id: '2',
    source: 'MISP',
    type: 'Phishing Campaign',
    indicators: ['evil-domain.com', 'malicious-site.net'],
    timestamp: new Date().toISOString(),
    severity: 'critical',
  },
];

export const threatMapData = [
  { lat: 40.7128, lng: -74.0060, intensity: 80, type: 'ddos' },
  { lat: 51.5074, lng: -0.1278, intensity: 60, type: 'malware' },
  { lat: 35.6762, lng: 139.6503, intensity: 90, type: 'ransomware' },
  { lat: 1.3521, lng: 103.8198, intensity: 70, type: 'phishing' },
];