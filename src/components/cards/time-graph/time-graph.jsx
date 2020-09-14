import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import fetchAllUrls from '../../../utils/fetch-all-urls/fetch-all-urls';
import flattenArray from '../../../utils/flatten-array/flatten-array';
import LineGraph from '../../graphs/line-graph/line-graph';
import CardWrapper from '../../card-wrapper/card-wrapper';
import getString from '../../../localisation/get-string/get-string';
import getMetricsConfig from '../../../utils/get-metrics-config/get-metrics-config';
import formatTimestamp from '../../../utils/format-timestamp/format-timestamp';

const TimeGraph = ({ uris, activeType, onReady, hidden }) => {
  const [graphData, setGraphData] = useState(null);

  const fetchURIs = async () => {
    const metricsConfig = getMetricsConfig();

    // Get the full URLs
    const urls = uris.map(
      uri =>
        `${metricsConfig.settings.base_url}?filter=work_uri:${metricsConfig.settings.work_uri},measure_uri:${uri}`
    );

    // Fetch all URLs
    // eslint-disable-next-line consistent-return
    fetchAllUrls(urls, res => {
      const data = flattenArray(res);

      // Make a key/value dictionary for each date
      const dates = {};
      data.forEach(item => {
        const date = item.timestamp;
        dates[date] = dates[date] ? dates[date] + item.value : item.value;
      });

      // There is no data
      if (Object.keys(dates).length === 0) return onReady();

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

      // Make sure we always have at least two data points
      // since the graph will render as empty if there is only one
      if (sorted.length === 1) {
        const dayBefore = new Date(sorted[0].key);
        dayBefore.setDate(dayBefore.getDate() - 1);
        sorted.unshift({ key: dayBefore.toISOString(), value: 0 });
      }

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
          xAxis.push(formatTimestamp(item.key));
        else xAxis.push('');
      });

      // Update the state with the new info
      setGraphData({
        series: sorted.map(date => date.value),
        xAxis
      });

      // Tell the parent that we're ready
      onReady();
    });
  };

  // Called when component mounts, or the array of UIRs changes
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    // No URIs provided, or the tab was closed
    if (!uris || uris.length === 0) return setGraphData(null);

    // Go through each URI and fetch its data
    fetchURIs();

    // On component unmount
    return () => setGraphData(null);
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
          seriesName={activeType}
          xAxisCategories={graphData.xAxis}
        />
      </CardWrapper>
    );
  return null;
};

TimeGraph.propTypes = {
  uris: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeType: PropTypes.string.isRequired,
  onReady: PropTypes.func,
  hidden: PropTypes.bool
};
TimeGraph.defaultProps = {
  hidden: false,
  onReady: null
};

export default TimeGraph;
