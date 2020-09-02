import React, { useEffect, useState } from 'react';
import fetchAllUrls from '../../../utils/fetch-all-urls/fetch-all-urls';
import flattenArray from '../../../utils/flatten-array/flatten-array';
import PropTypes from 'prop-types';
import LineGraph from '../../graphs/line-graph/line-graph';
import CardWrapper from '../../card-wrapper/card-wrapper';
import getString from '../../../localisation/get-string/get-string';

const TimeGraph = ({ uris, activeType, onReady, hidden }) => {
  const [graphData, setGraphData] = useState(null);

  const fetchURIs = async () => {
    // Get the full URLs
    const urls = uris.map(
      uri =>
        `${metrics_config.settings.base_url}?filter=work_uri:${metrics_config.settings.work_uri},measure_uri:${uri}`
    );

    // Fetch all URLs
    fetchAllUrls(urls, res => {
      const data = flattenArray(res);

      // Make a key/value dictionary for each date
      const dates = {};
      data.forEach(item => {
        const date = item.timestamp.split('T')[0]; // TODO: should we use Date() functions here instead?
        dates[date] = dates[date] ? dates[date] + item.value : item.value;
      });

      // Dates should already be in order, but sort them just to be sure.
      // This function will sort by the oldest dates first
      const sorted = [];
      Object.keys(dates).forEach(date => {
        sorted.push({ key: date, value: dates[date] });
      });
      sorted.sort((a, b) => {
        if (a.key < b.key) return -1;
        if (a.key > b.key) return 1;
        return 0;
      });

      // Go through each item to make it cumulative
      sorted.forEach((item, index) => {
        if (index > 0) {
          sorted[index].value += sorted[index - 1].value;
        }
      });

      // Determine the xAxis categories
      const xAxis = [];
      sorted.forEach((item, index) => {
        if (
          index === 0 ||
          index === Math.floor(sorted.length / 2) ||
          index === sorted.length - 1
        )
          xAxis.push(item.key);
        else xAxis.push('');
      });

      // Update the state with the new info
      setGraphData({
        series: sorted.map(date => date.value),
        xAxis: xAxis
      });

      // Tell the parent that we're ready
      onReady();
    });
  };

  // Called when component mounts, or the array of UIRs changes
  useEffect(() => {
    // No URIs provided, or the tab was closed
    if (!uris || uris.length === 0) return setGraphData(null);

    // Go through each URI and fetch its data
    fetchURIs();
  }, [uris]);

  if (hidden) return null;
  if (graphData)
    return (
      <CardWrapper
        label={getString('labels.over_time', { name: activeType })}
        data-testid='time-graph'
      >
        <LineGraph
          seriesData={graphData.series}
          xAxisCategories={graphData.xAxis}
        />
      </CardWrapper>
    );
  return null;
};

TimeGraph.propTypes = {
  uris: PropTypes.array.isRequired,
  activeType: PropTypes.string.isRequired,
  onReady: PropTypes.func,
  hidden: PropTypes.bool
};

export default TimeGraph;
