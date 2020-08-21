import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import KeyValueTable from '../../graphs/key-value-table/key-value-table';
import fetchAllUrls from '../../../utils/fetch-all-urls/fetch-all-urls';
import flattenArray from '../../../utils/flatten-array/flatten-array';
import countryCodeFromURI from '../../../utils/country-code-from-uri/country-code-from-uri';

const CountryTable = ({ uris, onReady, hidden }) => {
  const [tableData, setTableData] = useState(null);

  const fetchURIs = async () => {
    // Get the full URLs
    const urls = uris.map(
      uri =>
        `${metrics_config.settings.base_url}?filter=work_uri:${metrics_config.settings.work_uri},measure_uri:${uri}`
    );

    // Fetch all URLs
    fetchAllUrls(urls, res => {
      const data = flattenArray(res).filter(item => item.country_uri);

      // Pull the country codes from each item
      const codes = {};
      data.forEach(({ country_uri, value }) => {
        const code = countryCodeFromURI(country_uri);
        codes[code] = codes[code] ? codes[code] + value : value;
      });

      // TODO: Should we find a way to localise these codes?

      // Move into an array and sort
      const sorted = [];
      Object.keys(codes).forEach(code => {
        sorted.push({ key: code, value: codes[code].toString() });
      });
      sorted.sort((a, b) => b.value - a.value);

      // Update the state with the new info
      setTableData(sorted);

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
  if (tableData) return <KeyValueTable data={tableData} />;
  return null;
};

CountryTable.propTypes = {
  uris: PropTypes.array.isRequired,
  onReady: PropTypes.func,
  hidden: PropTypes.bool
};

export default CountryTable;
