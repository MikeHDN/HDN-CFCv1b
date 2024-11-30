import { openDB } from 'idb';
import type { DBSchema } from 'idb';

interface ThreatDB extends DBSchema {
  'threat-data': {
    key: string;
    value: {
      ip: string;
      isRange: boolean;
      isMalicious: boolean;
      timestamp: number;
    };
  };
  'geo-data': {
    key: string;
    value: {
      ip: string;
      lat: number;
      lng: number;
      country: string;
      city?: string;
    };
  };
}

const DB_NAME = 'hdn-threat-db';
const DB_VERSION = 1;

export async function initDB() {
  return openDB<ThreatDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('threat-data')) {
        db.createObjectStore('threat-data', { keyPath: 'ip' });
      }
      if (!db.objectStoreNames.contains('geo-data')) {
        db.createObjectStore('geo-data', { keyPath: 'ip' });
      }
    },
  });
}

export async function storeThreatData(data: any[]) {
  try {
    const db = await initDB();
    const tx = db.transaction('threat-data', 'readwrite');
    const store = tx.objectStore('threat-data');
    
    await Promise.all(
      data.map(item => store.put({
        ...item,
        timestamp: Date.now()
      }))
    );
    
    await tx.done;
  } catch (error) {
    console.error('Error storing threat data:', error);
  }
}

export async function getThreatData() {
  try {
    const db = await initDB();
    return await db.getAll('threat-data');
  } catch (error) {
    console.error('Error getting threat data:', error);
    return [];
  }
}

export async function storeGeoData(data: any[]) {
  try {
    const db = await initDB();
    const tx = db.transaction('geo-data', 'readwrite');
    const store = tx.objectStore('geo-data');
    
    await Promise.all(
      data.map(item => store.put(item))
    );
    
    await tx.done;
  } catch (error) {
    console.error('Error storing geo data:', error);
  }
}

export async function getGeoData() {
  try {
    const db = await initDB();
    return await db.getAll('geo-data');
  } catch (error) {
    console.error('Error getting geo data:', error);
    return [];
  }
}