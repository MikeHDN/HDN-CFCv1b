import { createReadStream, writeFileSync } from 'fs';
import { join } from 'path';
import Papa from 'papaparse';

async function processStatsFiles() {
  try {
    const asnStats = {};
    const domainStats = {};
    let totalEntries = 0;
    let totalCves = 0;

    // Process the CSV file in chunks
    const processChunk = (results) => {
      results.data.forEach(record => {
        if (!record.asn || !record.domain) return;

        // Process ASN stats
        const asn = record.asn.trim();
        if (!asnStats[asn]) {
          asnStats[asn] = {
            count: 0,
            totalCves: 0,
            cities: new Set()
          };
        }
        asnStats[asn].count++;
        asnStats[asn].totalCves += parseInt(record.cve_count) || 0;
        asnStats[asn].cities.add(record.domain);

        // Process domain stats
        const domain = record.domain.trim();
        if (!domainStats[domain]) {
          domainStats[domain] = 0;
        }
        domainStats[domain] += parseInt(record.cve_count) || 0;

        // Update totals
        totalEntries++;
        totalCves += parseInt(record.cve_count) || 0;
      });
    };

    // Read and parse CSV in chunks
    const fileStream = createReadStream(join(process.cwd(), 'public/data', 'highrisk_with_cves.csv'));
    
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

    // Calculate top ASNs
    const topAsns = Object.entries(asnStats)
      .map(([asn, stats]) => ({
        asn,
        count: stats.count,
        uniqueCities: stats.cities.size,
        totalCves: stats.totalCves,
        riskScore: (stats.totalCves * 0.6) + (stats.count * 0.4)
      }))
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 20);

    // Calculate top domains
    const topDomains = Object.entries(domainStats)
      .map(([domain, cveCount]) => ({ domain, cveCount }))
      .sort((a, b) => b.cveCount - a.cveCount)
      .slice(0, 20);

    const stats = {
      topAsns,
      topDomains,
      totalEntries,
      totalCves,
      lastUpdated: new Date().toISOString()
    };

    // Save processed stats
    const outputPath = join(process.cwd(), 'public', 'stats.json');
    writeFileSync(outputPath, JSON.stringify(stats, null, 2));

    console.log('Stats processed successfully:');
    console.log(`- Total Entries: ${stats.totalEntries}`);
    console.log(`- Total CVEs: ${stats.totalCves}`);
    console.log(`- Top ASNs: ${stats.topAsns.length}`);
    console.log(`- Top Domains: ${stats.topDomains.length}`);

  } catch (error) {
    console.error('Error processing stats:', error);
    process.exit(1);
  }
}

processStatsFiles();