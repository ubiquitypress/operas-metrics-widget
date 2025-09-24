import type { CachedItem } from '../cache';
import { cache } from '../cache';

export const createCache = <T>(url: string) => {
  cache[url] = { loading: true, onLoad: [] } as CachedItem<T>;
};
