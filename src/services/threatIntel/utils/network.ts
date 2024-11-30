import axios, { AxiosResponse } from 'axios';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const TIMEOUT = 5000;

export async function fetchWithRetry(url: string, retries = MAX_RETRIES): Promise<AxiosResponse> {
  try {
    return await axios.get(url, {
      timeout: TIMEOUT,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'HDN-CFC-Platform/1.0.0'
      }
    });
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(url, retries - 1);
    }
    throw error;
  }
}

export async function fetchWithCache<T>(
  url: string,
  cacheKey: string,
  cacheDuration: number = 3600000 // 1 hour
): Promise<T> {
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < cacheDuration) {
      return data;
    }
  }

  const response = await fetchWithRetry(url);
  const data = response.data;
  
  localStorage.setItem(cacheKey, JSON.stringify({
    data,
    timestamp: Date.now()
  }));

  return data;
}