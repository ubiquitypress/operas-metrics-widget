import type { Config, DatasetRange } from '@/types';
import { formatDate } from './format-date';
import { incrementDate } from './increment-date';

export const generateCompleteTimestamps = (
  startDate: Date,
  endDate: Date,
  range: DatasetRange,
  config: Config
): string[] => {
  const completeTimestamps: string[] = [];
  let d = new Date(startDate);
  while (d < endDate) {
    const formattedDate = formatDate(d, range, config);
    if (formattedDate) {
      completeTimestamps.push(formattedDate);
    }
    d = incrementDate(d, range);
  }
  return completeTimestamps;
};
