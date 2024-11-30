# HDN-CFC Platform

A modern web-based Cyber Fusion Center platform for threat intelligence and security operations.

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/yourusername/hdn-cfc-platform.git
cd hdn-cfc-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up data files:
   - Create a `public/data` directory
   - Place `GeoLite2-City.mmdb` in `public/data/`
   - Place `firehol_data.csv` in `public/data/`
   - Place `highrisk_with_cves.csv` in `public/data/`

4. Process initial data:
```bash
npm run process-stats
```

5. Start the development server:
```bash
npm run dev
```

## Data Files

The application requires the following data files in `public/data/`:

### GeoLite2 Database
- File: `GeoLite2-City.mmdb`
- Purpose: IP geolocation
- Source: MaxMind GeoLite2

### FireHOL Data
- File: `firehol_data.csv`
- Format: CSV with columns: ip_range,is_malicious
- Purpose: Threat intelligence data

### High-Risk Data
- File: `highrisk_with_cves.csv`
- Format: CSV with columns: domain,addr,asn,cve_count
- Purpose: ASN and domain risk analysis

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run process-stats` - Process statistics from CSV data