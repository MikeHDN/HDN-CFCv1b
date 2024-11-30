import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Reader } from '@maxmind/geoip2-node';

async function processGeoData() {
  try {
    // Create data directory if it doesn't exist
    const dataDir = join(process.cwd(), 'public', 'data');
    try {
      writeFileSync(join(dataDir, '.gitkeep'), '');
    } catch (err) {
      console.warn('Data directory already exists');
    }

    // Read GeoLite2 database
    console.log('Reading GeoLite2 database...');
    const buffer = readFileSync(join(process.cwd(), 'data', 'GeoLite2-City.mmdb'));
    const reader = await Reader.openBuffer(buffer);
    
    // Read FireHOL data from netset file
    console.log('Reading FireHOL data...');
    const fireholData = readFileSync(join(process.cwd(), 'data', 'firehol_level1.netset'), 'utf-8');
    const ips = fireholData
      .split('\n')
      .filter(line => line && !line.startsWith('#'))
      .map(line => line.trim())
      .filter(ip => !ip.includes('/'));

    console.log(`Processing ${ips.length} IP addresses...`);
    const geoData = {};
    let processed = 0;
    let failed = 0;
    
    for (const ip of ips) {
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

    const outputPath = join(process.cwd(), 'public', 'data', 'geo_data.json');
    writeFileSync(outputPath, JSON.stringify(geoData, null, 2));

    console.log('\nProcessing complete:');
    console.log(`- Successfully processed: ${processed} IP addresses`);
    console.log(`- Failed lookups: ${failed} IP addresses`);
    console.log(`- Total unique IPs: ${ips.length}`);
    console.log(`\nGeo data saved to: ${outputPath}`);
  } catch (error) {
    console.error('Error processing geo data:', error);
    process.exit(1);
  }
}

processGeoData();