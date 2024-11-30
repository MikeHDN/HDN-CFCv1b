import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const DATA_DIR = join(process.cwd(), 'data');
const PUBLIC_DATA_DIR = join(process.cwd(), 'public', 'data');
const PUBLIC_IMAGES_DIR = join(process.cwd(), 'public');

function setupDataDirectories() {
  try {
    // Create main data directory if it doesn't exist
    if (!existsSync(DATA_DIR)) {
      mkdirSync(DATA_DIR, { recursive: true });
      console.log('Created data directory');
    }

    // Create public data directory if it doesn't exist
    if (!existsSync(PUBLIC_DATA_DIR)) {
      mkdirSync(PUBLIC_DATA_DIR, { recursive: true });
      console.log('Created public data directory');
    }

    // Create public images directory if it doesn't exist
    if (!existsSync(PUBLIC_IMAGES_DIR)) {
      mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });
      console.log('Created public images directory');
    }

    console.log(`
Data Directory Setup Complete!

Please add the following files to the ${DATA_DIR} directory:
1. GeoLite2-City.mmdb - MaxMind GeoLite2 City Database
2. highrisk_with_cves.csv - High-risk CVE data file
3. firehol_level1.netset - FireHOL Level 1 IP list

Please add the following files to the ${PUBLIC_IMAGES_DIR} directory:
1. ai-advisor-logo.png - AI Advisor logo image

Then run the following commands in order:
1. npm run process-stats    # Process the CVE statistics
2. npm run process-geo      # Process geographical data
3. npm run process-domains  # Process high-risk domains

Or run them all at once with:
npm run process-all
    `);
  } catch (error) {
    console.error('Error setting up data directories:', error);
    process.exit(1);
  }
}

setupDataDirectories();