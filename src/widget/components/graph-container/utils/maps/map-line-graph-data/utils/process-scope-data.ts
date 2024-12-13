import type { APIEvent, Config, DatasetRange } from '@/types';
import { formatDate } from './format-date';

export const processScopeData = (
  scopeData: APIEvent[],
  range: DatasetRange,
  config: Config
): Record<string, number> => {
  const scopeDataLookup: Record<string, number> = {};

  for (const event of scopeData) {
    const formattedDate = formatDate(new Date(event.timestamp), range, config);
    if (formattedDate) {
      scopeDataLookup[formattedDate] =
        (scopeDataLookup[formattedDate] || 0) + event.value;
    }
  }
  return scopeDataLookup;
};
