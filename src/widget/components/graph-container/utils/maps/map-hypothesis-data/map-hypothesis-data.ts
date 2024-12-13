import type { HypothesisData } from '@/components/graphs';
import type { Config, GraphData } from '@/types';
import { HTTPRequest } from '@/utils';
import type { HypothesisAPIResponse } from './types';

export const mapHypothesisData = async (
  data: GraphData,
  config: Config
): Promise<HypothesisData[]> => {
  const values: HypothesisData[] = [];

  await Promise.all(
    data.merged.map(async event => {
      const { event_uri } = event;

      // Make sure the URI is valid
      if (!event_uri) {
        return;
      }

      // Get the ID from the URI
      const id = event_uri.split('/').pop();

      // Make sure the ID is valid
      if (!id) {
        return;
      }

      // Fetch the hypothesis data from the API
      const res = await HTTPRequest<HypothesisAPIResponse>({
        method: 'GET',
        url: `https://api.hypothes.is/api/annotations/${id}`
      });

      // Return the data in the correct format
      values.push({
        id,
        date: new Date(res.created).toLocaleDateString(config.settings.locale, {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
        author:
          res.user.split(':').length > 1 ? res.user.split(':')[1] : res.user,
        summary: {
          text: res.document.title[0],
          link: res.links.html
        }
      });
    })
  );

  // Sort the data by date
  values.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateA > dateB ? -1 : 1;
  });

  // Return the data
  return values;
};
