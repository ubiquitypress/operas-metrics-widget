import type { Config, DatasetRange } from '@/types';

export const formatDate = (date: Date, range: DatasetRange, config: Config) => {
  switch (range) {
    case 'years': {
      return new Date(date.toISOString().split('-')[0]).toLocaleDateString(
        config.settings.locale,
        { year: 'numeric' }
      );
    }
    case 'months': {
      return new Date(
        date.toISOString().split('-').slice(0, 2).join('-')
      ).toLocaleDateString(config.settings.locale, {
        month: 'short',
        year: 'numeric'
      });
    }
    default: {
      return new Date(date.toISOString().split('T')[0]).toLocaleDateString(
        config.settings.locale,
        { day: 'numeric', month: 'short', year: 'numeric' }
      );
    }
  }
};
