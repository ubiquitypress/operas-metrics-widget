import type { Config, DatasetRange } from '@/types';

export const formatDate = (date: Date, range: DatasetRange, config: Config) => {
  const locale = config.settings.locale;
  const options = { timeZone: 'UTC' } as const;

  switch (range) {
    case 'years': {
      const utcYear = Date.UTC(date.getUTCFullYear(), 0, 1);
      return new Date(utcYear).toLocaleDateString(locale, {
        year: 'numeric',
        ...options
      });
    }
    case 'months': {
      const utcMonth = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1);
      return new Date(utcMonth).toLocaleDateString(locale, {
        month: 'short',
        year: 'numeric',
        ...options
      });
    }
    default: {
      const utcDay = Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate()
      );
      return new Date(utcDay).toLocaleDateString(locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        ...options
      });
    }
  }
};
