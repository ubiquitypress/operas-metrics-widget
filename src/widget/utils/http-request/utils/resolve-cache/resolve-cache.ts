import { cache } from '../cache';

export const resolveCache = (url: string, data: any) => {
  for (const callback of cache[url].onLoad) {
    callback(data);
  }

  // Update the cache
  cache[url].data = data;
  cache[url].loading = false;
};
