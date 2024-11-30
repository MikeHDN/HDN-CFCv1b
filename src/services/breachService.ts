import { openDB } from 'idb';
import { readFile } from './fileSystem';

interface BreachDB extends DBSchema {
  breaches: {
    key: string;
    value: {
      email: string;
      domain: string;
      source: string;
      date: string;
      type: string;
      description: string;
      affectedData: string[];
    };
  };
  settings: {
    key: string;
    value: {
      searchPaths: string[];
      targetDomains: string[];
      lastScan: string;
    };
  };
}

const DB_NAME = 'hdn-breach-db';
const DB_VERSION = 1;

async function initDB() {
  return openDB<BreachDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('breaches')) {
        db.createObjectStore('breaches', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings');
      }
    },
  });
}

export async function searchBreaches(term: string) {
  try {
    const db = await initDB();
    const settings = await db.get('settings', 'search-config');
    
    // If we have search paths configured, scan local files
    if (settings?.searchPaths?.length) {
      await scanLocalFiles(settings.searchPaths, settings.targetDomains || []);
    }
    
    // Search in local database
    const breaches = await db.getAll('breaches');
    return breaches.filter(breach => 
      breach.email?.toLowerCase().includes(term.toLowerCase()) ||
      breach.domain?.toLowerCase().includes(term.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching breaches:', error);
    throw error;
  }
}

async function scanLocalFiles(paths: string[], domains: string[]) {
  try {
    for (const path of paths) {
      const files = await window.showDirectoryPicker({
        startIn: path,
        mode: 'read'
      });
      
      await scanDirectory(files, domains);
    }
  } catch (error) {
    console.error('Error scanning files:', error);
    throw error;
  }
}

async function scanDirectory(dirHandle: FileSystemDirectoryHandle, domains: string[]) {
  const db = await initDB();
  const tx = db.transaction('breaches', 'readwrite');
  const store = tx.objectStore('breaches');

  for await (const entry of dirHandle.values()) {
    if (entry.kind === 'file') {
      const file = await entry.getFile();
      const text = await file.text();
      
      // Search for email patterns
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      const emails = text.match(emailRegex) || [];
      
      // Filter by target domains
      const matchedEmails = emails.filter(email => 
        domains.some(domain => email.toLowerCase().endsWith(domain.toLowerCase()))
      );

      // Store matches
      for (const email of matchedEmails) {
        await store.put({
          id: `${email}-${file.name}`,
          email,
          domain: email.split('@')[1],
          source: file.name,
          date: new Date().toISOString(),
          type: 'Local File',
          description: `Found in ${file.name}`,
          affectedData: ['email']
        });
      }
    } else if (entry.kind === 'directory') {
      await scanDirectory(entry, domains);
    }
  }

  await tx.done;
}

export async function updateSearchSettings(paths: string[], domains: string[]) {
  const db = await initDB();
  await db.put('settings', {
    searchPaths: paths,
    targetDomains: domains,
    lastScan: new Date().toISOString()
  }, 'search-config');
}

export async function getSearchSettings() {
  const db = await initDB();
  return await db.get('settings', 'search-config') || {
    searchPaths: [],
    targetDomains: [],
    lastScan: null
  };
}