import axios from 'axios';
import { createCache, getCache, isCached, resolveCache } from './utils';

interface HTTPRequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  noCache?: boolean;
}

/**
 * Utility function to make HTTP requests
 */
export const HTTPRequest = async <T>(
  options: HTTPRequestOptions
): Promise<T> => {
  const { method, url, noCache } = options;
  const shouldCache = noCache !== true;

  try {
    // Check the cache for the data
    if (shouldCache && isCached(url)) {
      return getCache<T>(url);
    }

    // Create a new cache entry for this request
    if (shouldCache) {
      createCache<T>(url);
    }

    // Make the request
    const { data } = await axios<T>({
      method: method,
      url: url
    });

    // Update the cache
    if (shouldCache) {
      resolveCache<T>(url, data);
    }

    // Return the data
    return data;
  } catch {
    // We must resolve the cache, to allow functions waiting for the data to continue
    if (shouldCache) {
      resolveCache<T>(url, { data: [] } as T);
    }

    // Return a rejected promise
    throw new Error('HTTP request failed');
  }
};
