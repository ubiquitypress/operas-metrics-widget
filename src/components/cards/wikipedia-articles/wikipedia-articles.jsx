import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import fetchAllUrls from '../../../utils/fetch-all-urls/fetch-all-urls';
import flattenArray from '../../../utils/flatten-array/flatten-array';
import CardWrapper from '../../card-wrapper/card-wrapper';
import getString from '../../../localisation/get-string/get-string';
import KeyValueTable from '../../graphs/key-value-table/key-value-table';

const WikipediaArticles = ({ uris, onReady, hidden }) => {
  const [tableData, setTableData] = useState(null);

  const fetchURIs = async () => {
    // Get the full URLs
    const urls = uris.map(
      uri =>
        `${metrics_config.settings.base_url}?filter=work_uri:${metrics_config.settings.work_uri},measure_uri:${uri}`
    );

    // Fetch all URLs
    fetchAllUrls(urls, res => {
      const data = flattenArray(res).filter(item => item.event_uri);

      // Get an array of articles
      const mapped = data
        .map(item => item.event_uri) // populate only with event_uri values
        .map(item => item.replace(/.*\/wiki\//g, '')) // remove URL part of string
        .map(item => item.replace(/_/g, ' ')) // replace _ with a space
        .map(item => decodeURIComponent(item)); // decode any encoded characters

      // Sort alphabetically
      mapped.sort();

      // Convert into a key/value object for the table
      const keyValue = mapped.map(item => ({ key: item, value: null }));

      // Update the state with the new info
      setTableData(keyValue);

      // Tell the parent that we're ready
      onReady();
    });
  };

  // Called when component mounts, or the array of UIRs changes
  useEffect(() => {
    // No URIs provided, or the tab was closed
    if (!uris || uris.length === 0) return setTableData(null);

    // Go through each URI and fetch its data
    fetchURIs();
  }, [uris]);

  if (hidden) return null;
  if (tableData)
    return (
      <CardWrapper
        label={getString('labels.wikipedia_articles')}
        data-testid='wikipedia-articles'
      >
        <KeyValueTable data={tableData} />
      </CardWrapper>
    );
  return null;
};

WikipediaArticles.propTypes = {
  uris: PropTypes.array.isRequired,
  onReady: PropTypes.func,
  hidden: PropTypes.bool
};

export default WikipediaArticles;
