import fastq from 'fastq';
import type { queueAsPromised } from 'fastq';
import pMap from 'p-map';

interface Task<T> {
  data: T;
  operation: (data: T) => Promise<void>;
}

export class AsyncQueue<T> {
  private queue: queueAsPromised<Task<T>>;

  constructor(concurrency: number = 4) {
    this.queue = fastq.promise(this.worker.bind(this), concurrency);
  }

  private async worker(task: Task<T>): Promise<void> {
    try {
      await task.operation(task.data);
    } catch (error) {
      console.error('Task failed:', error);
      throw error;
    }
  }

  async add(data: T, operation: (data: T) => Promise<void>): Promise<void> {
    await this.queue.push({ data, operation });
  }

  async processItems<T>(
    items: T[],
    operation: (item: T) => Promise<void>,
    { concurrency = 4 } = {}
  ): Promise<void> {
    await pMap(items, operation, { concurrency });
  }
}