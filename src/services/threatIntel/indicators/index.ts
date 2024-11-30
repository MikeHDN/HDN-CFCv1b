import { fetchFireholIndicators } from './firehol';
import { fetchExploitIndicators } from './exploitDb';
import type { ThreatFeed } from '../../../types';

export async function fetchAllIndicators(): Promise<ThreatFeed[]> {
  try {
    const [fireholData, exploitData] = await Promise.all([
      fetchFireholIndicators(),
      fetchExploitIndicators()
    ]);

    return [...fireholData, ...exploitData].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch (error) {
    console.error('Error fetching indicators:', error);
    return [];
  }
}

export * from './firehol';
export * from './exploitDb';