import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Reader } from '@maxmind/geoip2-node';

async function fetchAndProcessData() {
  try {
    // Create data directory if it doesn't exist
    const dataDir = join(process.cwd(), 'public', 'data');
    try {
      writeFileSync(join(dataDir, '.gitkeep'), '');
    } catch (err) {
      console.warn('Data directory already exists');
    }

    // Process FireHOL data from .netset file
    console.log('Processing FireHOL data...');
    const fireholData = readFileSync(join(process.cwd(), 'data', 'firehol_level1.netset'), 'utf-8');
    const entries = fireholData
      .split('\n')
      .filter(line => line && !line.startsWith('#'))
      .map(line => {
        const ip = line.trim();
        return {
          ip,
          isRange: ip.includes('/'),
          isMalicious: true
        };
      })
      .filter(entry => entry.ip);

    // Save processed FireHOL data
    const fireholOutput = join(process.cwd(), 'public', 'data', 'firehol_processed.json');
    writeFileSync(fireholOutput, JSON.stringify(entries, null, 2));
    console.log(`Processed ${entries.length} FireHOL entries`);

    // Process geo data for non-range IPs
    console.log('\nProcessing geo data...');
    const buffer = readFileSync(join(process.cwd(), 'data', 'GeoLite2-City.mmdb'));
    const reader = await Reader.openBuffer(buffer);
    
    const singleIps = entries.filter(e => !e.isRange).map(e => e.ip);
    console.log(`Found ${singleIps.length} single IPs to process`);

    const geoData = {};
    let processed = 0;
    let failed = 0;

    for (const ip of singleIps) {
      try {
        const response = reader.city(ip);
        if (response.location.latitude && response.location.longitude) {
          geoData[ip] = {
            latitude: response.location.latitude,
            longitude: response.location.longitude,
            country: response.country?.names.en,
            city: response.city?.names.en
          };
          processed++;
        } else {
          failed++;
        }
      } catch (error) {
        failed++;
        continue;
      }

      // Log progress every 1000 IPs
      if ((processed + failed) % 1000 === 0) {
        console.log(`Processed ${processed} IP addresses (${failed} failed)...`);
      }
    }

    // Save processed geo data
    const geoOutput = join(process.cwd(), 'public', 'data', 'geo_data.json');
    writeFileSync(geoOutput, JSON.stringify(geoData, null, 2));

    console.log('\nProcessing complete:');
    console.log(`- FireHOL entries: ${entries.length}`);
    console.log(`- Geo lookups successful: ${processed}`);
    console.log(`- Geo lookups failed: ${failed}`);

  } catch (error) {
    console.error('Error processing data:', error);
    process.exit(1);
  }
}

fetchAndProcessData();