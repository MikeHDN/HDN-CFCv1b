export interface GeoLocation {
  ip: string;
  lat: number;
  lng: number;
  country?: string;
  city?: string;
  isMalicious: boolean;
  source: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'analyst' | 'operator';
  active: boolean;
}

export interface Incident {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'resolved';
  timestamp: string;
  description: string;
  assignedTo?: string;
}

export interface ThreatFeed {
  id: string;
  source: string;
  type: string;
  indicators: string[];
  timestamp: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}