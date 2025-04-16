import type { Config, Dataset, GraphData, LineGraph, Tab } from '@/types';
import {
  formatDate,
  generateCompleteTimestamps,
  getRange,
  getTimestamps,
  incrementDate,
  isCumulative,
  processScopeData
} from './utils';

interface Response {
  labels: string[];
  datasets: Dataset[];
}

export const mapLineGraphData = (
  data: GraphData,
  graph: LineGraph,
  tab: Tab,
  config: Config
): Response => {
  // Extract and sort timestamps from the data
  const timestamps = getTimestamps(data, config);

  // If there are no timestamps or scopes, return an empty dataset
  if (!timestamps || !graph.scopes || graph.scopes.length === 0) {
    return { labels: [], datasets: [] };
  }

  // Determine the date range based on the graph and timestamps
  const range = getRange(graph, timestamps);
  const rawTimestampsRange = timestamps.raw[range];
  if (rawTimestampsRange.length === 0) {
    return { labels: [], datasets: [] };
  }

  // Calculate start and end dates from the timestamps
  const startDate = new Date(rawTimestampsRange[0]);
  const endDate = new Date(rawTimestampsRange.at(-1) || '');
  const now = new Date();

  // Adjust the end date based on the current date and the chosen range
  endDate.setDate(now.getDate());
  if (range === 'years') {
    endDate.setMonth(now.getMonth());
  }

  // Generate a list of timestamps between the start and end dates
  const completeTimestamps = generateCompleteTimestamps(
    startDate,
    endDate,
    range,
    config
  );

  // Pre-compute if the graph is cumulative
  const isGraphCumulative = isCumulative(graph);

  // Convert each scope into a dataset
  const datasets: Dataset[] = graph.scopes.map(scope => {
    // Extract relevant data for the scope and generate a lookup object
    const scopeData = data.data[scope]?.data;
    if (!scopeData) {
      return { label: scope, data: [] };
    }

    const scopeDataLookup = processScopeData(scopeData, range, config);

    // Map each timestamp to its respective data value (or 0 if not present)
    let datasetData = completeTimestamps.map(
      timestamp => scopeDataLookup[timestamp] || 0
    );

    // If the graph is cumulative, accumulate the data values
    if (isGraphCumulative) {
      let accumulated = 0;
      datasetData = datasetData.map(value => {
        accumulated += value;
        return accumulated;
      });
    }

    // Determine the label for the dataset
    const label = tab.scopes[scope].title || scope;
    return { label, data: datasetData };
  });

  // Determine if an artificial zero is needed at the beginning of datasets
  const artificialZeroNeeded =
    graph.config?.artificial_zero &&
    datasets.every(dataset => dataset.data[0] !== 0);
  const someHaveSingleData = datasets.some(
    dataset => dataset.data.length === 1
  );

  // If needed, prepend an artificial zero to datasets
  if (artificialZeroNeeded || someHaveSingleData) {
    const first = new Date(completeTimestamps[0]);
    const formatted = formatDate(incrementDate(first, range), range, config);
    completeTimestamps.unshift(formatted);
    for (const dataset of datasets) {
      dataset.data.unshift(0);
    }
  }

  // If the graph is stacked, filter out datasets with no data and return
  if (graph.config?.stacked) {
    return {
      labels: completeTimestamps,
      datasets: datasets.filter(dataset =>
        dataset.data.some(value => value > 0)
      )
    };
  }

  // If not stacked, merge the data from all datasets into a single dataset
  const merged = completeTimestamps.map((_, idx) =>
    datasets.reduce((sum, dataset) => sum + (dataset.data[idx] || 0), 0)
  );

  return {
    labels: completeTimestamps,
    datasets: [{ data: merged }]
  };
};
