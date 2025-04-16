import type { DatasetRange } from '@/types';

export const incrementDate = (date: Date, range: DatasetRange): Date => {
  switch (range) {
    case 'years': {
      date.setUTCMonth(1);
      date.setUTCFullYear(date.getUTCFullYear() + 1);
      break;
    }
    case 'months': {
      date.setUTCDate(1);
      date.setUTCMonth(date.getUTCMonth() + 1);
      break;
    }
    default: {
      date.setUTCDate(date.getUTCDate() + 1);
      break;
    }
  }

  return date;
};
