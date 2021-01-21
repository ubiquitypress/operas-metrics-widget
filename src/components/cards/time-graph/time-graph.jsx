import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import fetchAllUrls from '../../../utils/fetch-all-urls/fetch-all-urls';
import flattenArray from '../../../utils/flatten-array/flatten-array';
import LineGraph from '../../graphs/line-graph/line-graph';
import CardWrapper from '../../card-wrapper/card-wrapper';
import getString from '../../../localisation/get-string/get-string';
import getMetricsConfig from '../../../utils/get-metrics-config/get-metrics-config';
import formatTimestamp from '../../../utils/format-timestamp/format-timestamp';

const TimeGraph = ({ uris, activeType, onReady, hidden, width, hideLabel }) => {
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

      // Make sure we have no missing data for a month
      const allDates = [];
      const uniqueDates = []; // used for calculating the midpoint
      try {
        const [todayYear, todayMonth] = new Date().toISOString().split('-');
        let [year, month] = sorted[0].key.split('-');
        // eslint-disable-next-line no-constant-condition
        while (true) {
          // eslint-disable-next-line no-loop-func
          const match = sorted.filter(({ key }) =>
            key.includes(`${year}-${month}`)
          );
          if (match.length > 0) match.forEach(item => allDates.push(item));
          else
            allDates.push({
              key: `${year}-${month}-01T00:00:00+0000`,
              value: 0
            });
          uniqueDates.push(`${year}-${month}-01T00:00:00+0000`);

          // Get the next date
          let nextMonth = (Number.parseInt(month, 10) + 1).toString();
          if (nextMonth === '13') nextMonth = '01';
          if (nextMonth.length === 1) nextMonth = `0${nextMonth}`;
          month = nextMonth;
          year =
            nextMonth === '01'
              ? (Number.parseInt(year, 10) + 1).toString()
              : year;

          if (year === todayYear && month === todayMonth) break;
        }
      } catch (err) {
        // Something went wrong
        console.error(err);
        sorted.forEach(item => allDates.push(item));
      }

      // Make sure we always have at least two data points
      // since the graph will render as empty if there is only one
      if (allDates.length === 1) {
        const dayBefore = new Date(sorted[0].key);
        dayBefore.setDate(dayBefore.getDate() - 1);
        allDates.unshift({ key: dayBefore.toISOString(), value: 0 });
      }

      // Go through each item to make it cumulative
      allDates.forEach((item, i) => {
        if (i > 0) allDates[i].value += allDates[i - 1].value;
      });

      // Determine the xAxis categories
      const xAxis = Array(allDates.length)
        .fill(null)
        .map(() => '');
      xAxis[0] = formatTimestamp(uniqueDates[0]); // first
      xAxis[Math.floor(allDates.length / 2)] = // median
        uniqueDates.length > 2
          ? formatTimestamp(uniqueDates[Math.floor(uniqueDates.length / 2) - 1])
          : '';
      xAxis[allDates.length - 1] = formatTimestamp(
        uniqueDates[uniqueDates.length - 1]
      ); // last

      // Update the state with the new info
      setGraphData({
        series: allDates.map(date => date.value),
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
        width={width}
        hideLabel={hideLabel}
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
  hidden: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  hideLabel: PropTypes.bool
};
TimeGraph.defaultProps = {
  hidden: false,
  onReady: null,
  width: null,
  hideLabel: null
};

export default TimeGraph;
