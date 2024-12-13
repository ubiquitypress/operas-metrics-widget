import { cache } from '../cache';

export const isCached = (url: string) => {
  return url in cache;
};
