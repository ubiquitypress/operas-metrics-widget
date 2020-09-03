import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import KeyValueTable from '../../graphs/key-value-table/key-value-table';
import fetchAllUrls from '../../../utils/fetch-all-urls/fetch-all-urls';
import flattenArray from '../../../utils/flatten-array/flatten-array';
import countryCodeFromURI from '../../../utils/country-code-from-uri/country-code-from-uri';
import CardWrapper from '../../card-wrapper/card-wrapper';
import getString from '../../../localisation/get-string/get-string';
import getMetricsConfig from '../../../utils/get-metrics-config/get-metrics-config';

const CountryTable = ({ uris, activeType, onReady, hidden }) => {
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
      const data = flattenArray(res).filter(item => item.country_uri);

      // Pull the country codes from each item
      const codes = {};
      data.forEach(({ country_uri, value }) => {
        let code = countryCodeFromURI(country_uri);

        // Localise the code, if specified in the settings
        if (metricsConfig.settings.localise_country_codes)
          code = getString(`countries.${code}`);

        codes[code] = codes[code] ? codes[code] + value : value;
      });

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
  // eslint-disable-next-line consistent-return
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
        label={getString('labels.by_country', { name: activeType })}
        data-testid='country-table'
      >
        <KeyValueTable data={tableData} />
      </CardWrapper>
    );
  return null;
};

CountryTable.propTypes = {
  uris: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeType: PropTypes.string.isRequired,
  onReady: PropTypes.func,
  hidden: PropTypes.bool
};
CountryTable.defaultProps = {
  hidden: false,
  onReady: null
};

export default CountryTable;
