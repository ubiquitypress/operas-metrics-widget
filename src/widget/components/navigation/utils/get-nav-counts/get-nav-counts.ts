import type { Config, NavCount } from '@/types';
import { HTTPRequest, log } from '@/utils';
import type { APIResponse } from './types';

/**
 * Fetches the `measure_uri` aggregation for each metric, returning the
 * total number of events for each measure, along with an individual count
 * @param config - The widget configuration object
 */
export const getNavCounts = async (config: Config): Promise<NavCount[]> => {
  // Create an array to store the counts
  const counts: NavCount[] = [];

  // Loop through every tab
  for (const tab of config.tabs) {
    // Create an object to store the counts for the current tab
    const data: NavCount = {
      id: tab.id,
      name: tab.name,
      total: 0,
      counts: {}
    };

    // Fetch the data for each metric
    await Promise.all(
      Object.keys(tab.scopes).map(async scope => {
        try {
          // Get the values
          const { measures, works } = tab.scopes[scope];

          // If there are no works, skip this metric (since otherwise it will return all events)
          if (works.filter(work => !!work).length === 0) {
            return;
          }

          // Merge the `works` into a single string
          const query = works.map(work => `work_uri:${work}`).join(',');

          // Make a request for the data
          const res = await HTTPRequest<APIResponse>({
            method: 'GET',
            url: `${config.settings.base_url}?filter=${query}`
          });

          // Filter out the data that doesn't match the metric's measures
          for (const event of res.data) {
            for (const measure of measures) {
              if (event.measure_uri.includes(measure)) {
                // Make sure the `timestamp` is past the `startDate`
                const startDate = tab.scopes[scope].startDate;
                if (
                  startDate &&
                  new Date(event.timestamp) < new Date(startDate)
                ) {
                  continue;
                }

                // Make sure the `timestamp` is before the `endDate`
                const endDate = tab.scopes[scope].endDate;
                if (endDate && new Date(event.timestamp) >= new Date(endDate)) {
                  continue;
                }

                // Increase the total by the event value
                data.total += event.value;

                // Add the data to the individual metric
                if (data.counts[scope]) {
                  data.counts[scope] += event.value;
                } else {
                  data.counts[scope] = event.value;
                }
              }
            }
          }
        } catch (err) {
          log.warn(`Could not fetch nav count data for "${scope}"`, err);
        }
      })
    );

    // Add the count to the array, in the preferred order
    if (tab.order === undefined) {
      counts.push(data);
    } else if (counts[tab.order]) {
      counts.splice(tab.order + 1, 0, data);
    } else {
      counts[tab.order] = data;
    }
  }

  // Return the counts, removing any empty tabs
  return counts.filter(count => count.total > 0);
};
