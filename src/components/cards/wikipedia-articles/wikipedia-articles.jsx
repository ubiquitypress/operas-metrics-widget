import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import fetchAllUrls from '../../../utils/fetch-all-urls/fetch-all-urls';
import flattenArray from '../../../utils/flatten-array/flatten-array';
import CardWrapper from '../../card-wrapper/card-wrapper';
import getString from '../../../localisation/get-string/get-string';
import KeyValueTable from '../../graphs/key-value-table/key-value-table';
import getMetricsConfig from '../../../utils/get-metrics-config/get-metrics-config';

const WikipediaArticles = ({ uris, onReady, hidden }) => {
  const [tableData, setTableData] = useState(null);

  const fetchURIs = async () => {
    const metricsConfig = getMetricsConfig();

    // Get the full URLs
    const urls = uris.map(
      uri =>
        `${metricsConfig.settings.base_url}?filter=work_uri:${metricsConfig.settings.work_uri},measure_uri:${uri}`
    );

    // Fetch all URLs
    fetchAllUrls(urls, res => {
      const data = flattenArray(res).filter(item => item.event_uri);

      // Remove data that does not contain an event URI, and return
      // an array of only the event URIs
      const filtered = data
        .filter(item => item.event_uri)
        .map(item => item.event_uri);

      // Sort the URIs alphabetically
      filtered.sort();

      // Convert into a key/value object for the table
      const keyValue = filtered.map(uri => {
        // Replace the key to be a string
        let key = uri.replace(/.*\/wiki\//g, '');
        key = key.replace(/_/g, ' ');
        key = decodeURIComponent(key);

        // Return an object for the KeyValueTable
        return { key, keyLink: uri, value: null };
      });

      // Update the state with the new info
      setTableData(keyValue);

      // Tell the parent that we're ready
      onReady();
    });
  };

  // Called when component mounts, or the array of UIRs changes
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    // No URIs provided, or the tab was closed
    if (!uris || uris.length === 0) return setTableData(null);

    // Go through each URI and fetch its data
    fetchURIs();

    // On component unmount
    return () => setTableData(null);
  }, [uris]);

  if (hidden) return null;
  if (tableData) {
    if (tableData.length === 0) return null;
    return (
      <CardWrapper
        label={getString('labels.wikipedia_articles')}
        data-testid='wikipedia-articles'
      >
        <KeyValueTable data={tableData} />
      </CardWrapper>
    );
  }
  return null;
};

WikipediaArticles.propTypes = {
  uris: PropTypes.arrayOf(PropTypes.string).isRequired,
  onReady: PropTypes.func,
  hidden: PropTypes.bool
};
WikipediaArticles.defaultProps = {
  hidden: false,
  onReady: null
};

export default WikipediaArticles;
