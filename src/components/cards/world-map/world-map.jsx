import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import flattenArray from '../../../utils/flatten-array/flatten-array';
import MapGraph from '../../graphs/map-graph/map-graph';
import fetchAllUrls from '../../../utils/fetch-all-urls/fetch-all-urls';
import countryCodeFromURI from '../../../utils/country-code-from-uri/country-code-from-uri';

const WorldMap = ({ uris, onReady, hidden }) => {
  const [codes, setCodes] = useState(null);

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

      // Update the state, so that we can view the data
      setCodes(codes);

      // Tell the parent that we're ready
      onReady();
    });
  };

  // Called when component mounts, or the array of UIRs changes
  useEffect(() => {
    // No URIs provided, or the tab was closed
    if (!uris || uris.length === 0) return setCodes(null);

    // Go through each URI and fetch its data
    fetchURIs();
  }, [uris]);

  if (hidden) return null;
  if (codes) return <MapGraph mapData={codes} />;
  return null;
};

WorldMap.propTypes = {
  uris: PropTypes.array.isRequired,
  hidden: PropTypes.bool,
  onReady: PropTypes.func
};

export default WorldMap;
