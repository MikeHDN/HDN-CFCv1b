```typescript
export interface ThreatSource {
  id: string;
  name: string;
  url: string;
  type: 'ip' | 'exploit' | 'vulnerability';
  enabled: boolean;
  parser?: (data: string) => any[];
}

export const DEFAULT_SOURCES: ThreatSource[] = [
  {
    id: 'firehol1',
    name: 'FireHOL Level 1',
    url: 'https://iplists.firehol.org/files/firehol_level1.netset',
    type: 'ip',
    enabled: true,
    parser: (data: string) => data
      .split('\n')
      .filter(line => line && !line.startsWith('#'))
      .map(ip => ({ ip: ip.trim(), source: 'FireHOL Level 1' }))
  },
  {
    id: 'emerging',
    name: 'Emerging Threats',
    url: 'http://rules.emergingthreats.net/fwrules/emerging-Block-IPs.txt',
    type: 'ip',
    enabled: true,
    parser: (data: string) => data
      .split('\n')
      .filter(line => line && !line.startsWith('#'))
      .map(ip => ({ ip: ip.trim(), source: 'Emerging Threats' }))
  },
  {
    id: 'exploitdb',
    name: 'ExploitDB',
    url: 'https://gitlab.com/api/v4/projects/exploit-database%2Fexploitdb/repository/files/files_exploits.csv/raw',
    type: 'exploit',
    enabled: true,
    parser: (data: string) => {
      const lines = data.split('\n');
      return lines.slice(1)
        .filter(Boolean)
        .map(line => {
          const [id, file, description, date, author, platform, type] = line.split(',');
          return { id, file, description, date, author, platform, type, source: 'ExploitDB' };
        });
    }
  }
];

export const API_CONFIG = {
  maxRetries: 3,
  timeout: 30000,
  headers: {
    'User-Agent': 'HDN-CFC-Platform/1.0'
  }
};
```