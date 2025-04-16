import type { Config, Graph, GraphData, Tab } from '@/types';
import { HTTPRequest } from '@/utils';
import type { APIResponse } from './types';

export const loadData = async (tab: Tab, graph: Graph, config: Config) => {
  // Get the list of sources, which will tell us which data to load
  const { scopes = [] } = graph;

  // Create an object to store the data
  const data: GraphData = {
    total: 0,
    data: {},
    merged: []
  };

  // Fetch the data for each metric
  await Promise.all(
    Object.keys(tab.scopes).map(async scope => {
      // Get the values
      const { measures, works } = tab.scopes[scope];

      // Make sure the metric is in the sources list
      if (!scopes.includes(scope)) {
        return;
      }

      // If there are no works, add an empty object to the data and then skip it since otherwise it will return all events)
      if (works.filter(work => !!work).length === 0) {
        data.data = {
          [scope]: { total: 0, data: [] }
        };
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
      let total = 0;
      const filtered = res.data.filter(event => {
        for (const measure of measures) {
          if (event.measure_uri.includes(measure)) {
            // Make sure the `timestamp` is past the `startDate`
            const startDate = tab.scopes[scope].startDate;
            if (startDate && new Date(event.timestamp) < new Date(startDate)) {
              return false;
            }

            // Make sure the `timestamp` is before the `endDate`
            const endDate = tab.scopes[scope].endDate;
            if (endDate && new Date(event.timestamp) >= new Date(endDate)) {
              return false;
            }

            // Increase the local total by the event value
            total += event.value;

            // Include the event in the filtered data
            return true;
          }
        }
        return false;
      });

      // Increase the global total by the local total
      data.total += total;

      // Add the data to the total
      data.data = {
        ...data.data,
        [scope]: {
          total,
          data: filtered
        }
      };

      // Add the data to the merged array
      data.merged = [...data.merged, ...filtered];
    })
  );

  return data;
};
