import fs from 'fs';
import path from 'path';
import axios from 'axios';
import AdmZip from 'adm-zip';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_DIR = path.join(__dirname, '../cache/nvd');
const META_URL = 'https://nvd.nist.gov/feeds/json/cve/1.1/nvdcve-1.1-modified.meta';
const DATA_URL = 'https://nvd.nist.gov/feeds/json/cve/1.1/nvdcve-1.1-{year}.json.zip';
const YEARS = Array.from({ length: 21 }, (_, i) => 2024 - i); // Last 20 years + current year

async function downloadFile(url, outputPath) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const zip = new AdmZip(response.data);
  zip.extractAllTo(outputPath, true);
}

async function updateNVDCache() {
  console.log('Updating NVD cache...');

  // Create cache directory if it doesn't exist
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }

  // Download and extract data for each year
  for (const year of YEARS) {
    const yearUrl = DATA_URL.replace('{year}', year);
    const yearPath = path.join(CACHE_DIR, `${year}`);
    
    console.log(`Downloading data for ${year}...`);
    try {
      await downloadFile(yearUrl, yearPath);
      console.log(`Successfully downloaded data for ${year}`);
    } catch (error) {
      console.error(`Error downloading data for ${year}:`, error.message);
    }

    // Wait 6 seconds between downloads to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 6000));
  }

  // Save metadata
  const meta = {
    lastUpdated: new Date().toISOString(),
    years: YEARS
  };
  fs.writeFileSync(
    path.join(CACHE_DIR, 'meta.json'),
    JSON.stringify(meta, null, 2)
  );

  console.log('NVD cache update complete!');
}

updateNVDCache().catch(console.error);