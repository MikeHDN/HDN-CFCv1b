import React from 'react';
import { Book, Terminal, Shield, Database, Code, Brain, Users, Scan, FileText } from 'lucide-react';

const sections = [
  {
    title: 'Getting Started',
    icon: Book,
    items: [
      {
        title: 'Installation',
        content: `
### Prerequisites
- Node.js 18.x or later
- npm 9.x or later

### Installation Steps
1. Install Node.js and npm
2. Clone the repository
3. Run \`npm install\` to install dependencies
4. Run \`npm run setup\` to create the data directory
5. Place your data files in the data directory:
   - GeoLite2-City.mmdb
   - highrisk_with_cves.csv
   - firehol_level1.netset
6. Run \`npm run process-stats\` to process the CVE data
7. Run \`npm run process-geo\` to process geographical data
8. Start the development server with \`npm run dev\`
        `
      },
      {
        title: 'Legal Requirements',
        content: `
### Legal Documents
1. Non-Disclosure Agreement (NDA)
   - Confidentiality obligations
   - Protection of proprietary information
   - Term and termination

2. License Agreement
   - Copyright © 2024 M.Goedeker MSc. & Hakdefnet GmbH
   - Usage restrictions
   - Zero liability clause
   - Intellectual property rights

3. Acceptance
   - Review and accept agreements in Settings
   - Required before using certain features
   - Binding upon acceptance
        `
      }
    ]
  },
  {
    title: 'Features',
    icon: Shield,
    items: [
      {
        title: 'Dashboard',
        content: `
### Dashboard Features
- Real-time threat statistics
- Top compromised ASNs visualization
- Most malicious domains tracking
- Active incident monitoring
- Breach detection status
- NEON Defense scan results
- Threat intelligence feeds
        `
      },
      {
        title: 'Threat Intelligence',
        content: `
### Threat Intelligence Features
- Global threat visualization
- Real-time threat feed monitoring
- FireHOL integration
- APT group tracking
- Recent APT activities
- Exploit database integration
- External intelligence sources
- Threat indicators monitoring
        `
      },
      {
        title: 'AI Advisor',
        content: `
### AI Capabilities
- Random Forest model training
- Breach probability prediction
- Feature importance analysis
- Model performance metrics
- ASN risk assessment
- Domain reputation scoring
- Vulnerability analysis
- System security evaluation
        `
      },
      {
        title: 'NEON Defense',
        content: `
### NEON Defense Features
- Local system scanning
- Network device discovery
- Vulnerability assessment
- Risk score calculation
- Breach probability prediction
- Real-time monitoring
- Multi-platform support:
  - Windows 10/11
  - Linux
  - macOS
        `
      }
    ]
  },
  {
    title: 'Data Management',
    icon: Database,
    items: [
      {
        title: 'Data Sources',
        content: `
### Required Data Files
1. GeoLite2 Database
   - File: GeoLite2-City.mmdb
   - Purpose: IP geolocation
   - Format: MaxMind DB

2. High-Risk Data
   - File: highrisk_with_cves.csv
   - Format: CSV with columns: domain,addr,asn,cve_count
   - Purpose: ASN and domain risk analysis

3. FireHOL Data
   - File: firehol_level1.netset
   - Format: IP/CIDR list
   - Purpose: Threat intelligence data
        `
      },
      {
        title: 'Data Processing',
        content: `
### Processing Scripts
1. Stats Processing
   - Command: \`npm run process-stats\`
   - Processes high-risk CVE data
   - Generates ASN statistics
   - Calculates domain risk scores

2. Geo Processing
   - Command: \`npm run process-geo\`
   - Processes IP geolocation data
   - Maps threat sources
   - Generates geographical statistics

3. Threat Data
   - Command: \`npm run fetch-data\`
   - Updates threat intelligence
   - Refreshes indicator database
        `
      }
    ]
  },
  {
    title: 'Administration',
    icon: Users,
    items: [
      {
        title: 'User Management',
        content: `
### Managing Users
1. Access Settings > User Management
2. Add new users with roles:
   - Admin: Full system access
   - Analyst: Analysis and reporting
   - Operator: Basic operations
3. Edit existing users
4. Manage permissions
        `
      },
      {
        title: 'System Settings',
        content: `
### Configuration Options
1. Appearance
   - Theme selection
   - Dark/Light mode
   - System preference

2. Notifications
   - Critical alerts
   - System updates
   - Threat intelligence
   - Incident updates

3. Security
   - API key management
   - Two-factor authentication
   - Session management
        `
      }
    ]
  }
];

export default function Documentation() {
  const [activeSection, setActiveSection] = React.useState(sections[0].title);
  const [activeItem, setActiveItem] = React.useState(sections[0].items[0].title);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Documentation</h1>

      <div className="flex gap-6">
        {/* Navigation */}
        <div className="w-64 bg-gray-800 rounded-lg p-4">
          {sections.map((section) => (
            <div key={section.title} className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <section.icon className="w-5 h-5 text-blue-500" />
                <h2 className="font-semibold">{section.title}</h2>
              </div>
              <ul className="space-y-1 ml-7">
                {section.items.map((item) => (
                  <li key={item.title}>
                    <button
                      onClick={() => {
                        setActiveSection(section.title);
                        setActiveItem(item.title);
                      }}
                      className={`text-sm px-3 py-1.5 rounded-lg w-full text-left ${
                        activeSection === section.title && activeItem === item.title
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {item.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-gray-800 rounded-lg p-6">
          {sections.map((section) =>
            section.items.map((item) => {
              if (activeSection === section.title && activeItem === item.title) {
                return (
                  <div key={item.title}>
                    <h2 className="text-xl font-semibold mb-4">{item.title}</h2>
                    <div className="prose prose-invert">
                      {item.content.split('\n').map((line, i) => (
                        <p key={i} className="mb-2">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            })
          )}
        </div>
      </div>
    </div>
  );
}