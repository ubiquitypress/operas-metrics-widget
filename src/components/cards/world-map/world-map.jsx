import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import flattenArray from '../../../utils/flatten-array/flatten-array';
import MapGraph from '../../graphs/map-graph/map-graph';
import fetchAllUrls from '../../../utils/fetch-all-urls/fetch-all-urls';
import countryCodeFromURI from '../../../utils/country-code-from-uri/country-code-from-uri';
import CardWrapper from '../../card-wrapper/card-wrapper';
import getString from '../../../localisation/get-string/get-string';
import getMetricsConfig from '../../../utils/get-metrics-config/get-metrics-config';

const WorldMap = ({ uris, activeType, onReady, hidden }) => {
  const [codes, setCodes] = useState(null);

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
      const countryCodes = {};
      data.forEach(({ country_uri, value }) => {
        const code = countryCodeFromURI(country_uri);
        countryCodes[code] = countryCodes[code]
          ? countryCodes[code] + value
          : value;
      });

      // Update the state, so that we can view the data
      setCodes(countryCodes);

      // Tell the parent that we're ready
      onReady();
    });
  };

  // Called when component mounts, or the array of UIRs changes
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    // No URIs provided, or the tab was closed
    if (!uris || uris.length === 0) return setCodes(null);

    // Go through each URI and fetch its data
    fetchURIs();
  }, [uris]);

  if (hidden) return null;
  if (codes)
    return (
      <CardWrapper
        label={getString('labels.by_country', { name: activeType })}
        data-testid='world-map'
      >
        <MapGraph mapData={codes} />
      </CardWrapper>
    );
  return null;
};

WorldMap.propTypes = {
  uris: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeType: PropTypes.string.isRequired,
  hidden: PropTypes.bool,
  onReady: PropTypes.func
};
WorldMap.defaultProps = {
  hidden: false,
  onReady: null
};

export default WorldMap;
