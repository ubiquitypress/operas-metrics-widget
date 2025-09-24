import type { CachedItem } from '../cache';
import { cache } from '../cache';

export const getCache = <T>(url: string): Promise<T> | T => {
  const entry = cache[url] as CachedItem<T> | undefined;
  if (!entry) {
    throw new Error(`Cache miss for ${url}`);
  }

  if (entry.loading) {
    return new Promise<T>(resolve => {
      entry.onLoad.push(resolve);
    });
  }

  return entry.data as T;
};
