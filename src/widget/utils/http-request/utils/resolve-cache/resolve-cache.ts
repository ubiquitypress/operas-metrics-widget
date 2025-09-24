import type { CachedItem } from '../cache';
import { cache } from '../cache';

export const resolveCache = <T>(url: string, data: T) => {
  const entry = cache[url] as CachedItem<T> | undefined;
  if (!entry) {
    return;
  }

  for (const callback of entry.onLoad) {
    callback(data);
  }

  // Update the cache
  entry.data = data;
  entry.loading = false;
};
