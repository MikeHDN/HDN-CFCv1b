import { openDB } from 'idb';

interface FileDB {
  'file-storage': {
    key: string;
    value: {
      name: string;
      type: string;
      data: ArrayBuffer;
      timestamp: number;
    };
  };
}

const DB_NAME = 'hdn-files-db';
const DB_VERSION = 1;

async function initDB() {
  return openDB<FileDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('file-storage')) {
        db.createObjectStore('file-storage');
      }
    },
  });
}

export async function storeFile(type: 'geolite' | 'highrisk', file: File) {
  const db = await initDB();
  const arrayBuffer = await file.arrayBuffer();
  
  await db.put('file-storage', {
    name: file.name,
    type: file.type,
    data: arrayBuffer,
    timestamp: Date.now()
  }, type);

  // If it's the high-risk CSV file, process it
  if (type === 'highrisk') {
    const text = await file.text();
    // Process the CSV data and update stats
    const worker = new Worker(new URL('./workers/processStats.ts', import.meta.url));
    worker.postMessage({ data: text });
  }
}

export async function getStoredFiles() {
  const db = await initDB();
  const geolite = await db.get('file-storage', 'geolite');
  const highrisk = await db.get('file-storage', 'highrisk');
  
  return {
    geolite: geolite?.name,
    highrisk: highrisk?.name
  };
}

export async function getFile(type: 'geolite' | 'highrisk') {
  const db = await initDB();
  return db.get('file-storage', type);
}