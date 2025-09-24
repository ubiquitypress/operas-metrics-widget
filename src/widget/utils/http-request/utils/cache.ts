export interface CachedItem<T> {
  loading: boolean;
  data?: T;
  onLoad: ((data: T) => void)[]; // a list of callbacks to call when the data is loaded
}

export const cache: Record<string, CachedItem<unknown>> = {};
