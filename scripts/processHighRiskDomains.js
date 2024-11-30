import { createReadStream, writeFileSync } from 'fs';
import { join } from 'path';
import Papa from 'papaparse';

async function processHighRiskDomains() {
  try {
    console.log('Processing high-risk domains data...');
    
    const domainMap = {};
    let processedCount = 0;

    // Process the CSV file in chunks
    const processChunk = (results) => {
      results.data.forEach(record => {
        if (record.domain && record.addr) {
          domainMap[record.domain] = {
            ip: record.addr,
            asn: record.asn || 'Unknown',
            cveCount: parseInt(record.cve_count) || 0,
            location: record.location || 'Unknown'
          };
          processedCount++;
        }
      });

      // Log progress every 1000 records
      if (processedCount % 1000 === 0) {
        console.log(`Processed ${processedCount} records...`);
      }
    };

    // Read and parse CSV in chunks
    const fileStream = createReadStream(join(process.cwd(), 'data', 'highrisk_with_cves.csv'));
    
    await new Promise((resolve, reject) => {
      Papa.parse(fileStream, {
        header: true,
        skipEmptyLines: true,
        transformHeader: header => header.trim(),
        transform: value => value?.trim() || '',
        chunk: processChunk,
        complete: resolve,
        error: reject,
        fastMode: true,
        chunkSize: 1024 * 1024 // Process 1MB at a time
      });
    });

    // Save processed data
    const outputPath = join(process.cwd(), 'public', 'data', 'highrisk_domains.json');
    writeFileSync(outputPath, JSON.stringify(domainMap, null, 2));

    console.log(`Successfully processed ${Object.keys(domainMap).length} high-risk domains`);
  } catch (error) {
    console.error('Error processing high-risk domains:', error);
    process.exit(1);
  }
}

processHighRiskDomains();