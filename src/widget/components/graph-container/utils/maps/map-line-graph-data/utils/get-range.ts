import type { DatasetRange, LineGraph } from '@/types';
import type { Timestamp } from './get-timestamps';

export const getRange = (
  graph: LineGraph,
  timestamps: Timestamp
): DatasetRange => {
  const preferredRange = graph.config?.range || 'auto';

  if (preferredRange === 'auto') {
    if (timestamps.raw.years.length >= 10) {
      return 'years';
    } else if (timestamps.raw.months.length > 1) {
      return 'months';
    } else {
      return 'days';
    }
  }

  return preferredRange;
};
