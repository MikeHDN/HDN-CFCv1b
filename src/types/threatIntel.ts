export interface ThreatIndicator {
  indicator: string;
  type: 'IP' | 'Domain' | 'URL' | 'Hash';
  source: string;
  confidence: 'low' | 'medium' | 'high';
  lastUpdated: string;
}

export interface ExploitData {
  id: string;
  file: string;
  description: string;
  date: string;
  author: string;
  platform: string;
  type: string;
  source: string;
}

export interface Vulnerability {
  id: string;
  description: string;
  severity: string;
  published: string;
  references: string[];
}

export interface APTGroup {
  id: string;
  name: string;
  aliases: string[];
  description: string;
  country?: string;
  firstSeen: string;
  lastSeen: string;
  targets: string[];
  tools: string[];
  techniques: string[];
  industries: string[];
  confidence: 'low' | 'medium' | 'high';
}

export interface APTActivity {
  id: string;
  groupId: string;
  type: 'Campaign' | 'Attack' | 'Tool' | 'Infrastructure';
  name: string;
  description: string;
  date: string;
  indicators: ThreatIndicator[];
  confidence: 'low' | 'medium' | 'high';
}