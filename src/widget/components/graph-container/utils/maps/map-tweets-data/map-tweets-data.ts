import type { GraphData } from '@/types';

export const mapTweetsData = (data: GraphData): string[] => {
  // Get the tweet IDs from the data
  const ids = data.merged.map(tweet => {
    return tweet.event_uri?.split('/').pop();
  });

  // Filter out any undefined IDs
  const filtered = ids.filter(Boolean);

  // Return the tweet IDs
  return filtered as string[];
};
