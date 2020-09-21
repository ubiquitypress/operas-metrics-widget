import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import flattenArray from '../../utils/flatten-array/flatten-array';
import fetchAllUrls from '../../utils/fetch-all-urls/fetch-all-urls';
import CardWrapper from '../card-wrapper/card-wrapper';
import getString from '../../localisation/get-string/get-string';
import getMetricsConfig from '../../utils/get-metrics-config/get-metrics-config';

const WorldMap = ({ uris, activeType, onReady, hidden, width, hideLabel }) => {
  // This is where we will store the FORMATTED data once we have it,
  // ready to be sent directly to the graph.
  const [formatted, setFormatted] = useState(null);

  // This async function will be called when the component mounts, and when
  // the array of URIs provided changes. It is responsible for fetching all
  // of the data from the URIs, formatting it into the required format of the
  // graph it will send data to, and then updating the state with this data.
  const fetchURIs = async () => {
    const metricsConfig = getMetricsConfig();
    const urls = uris.map(
      uri =>
        `${metricsConfig.settings.base_url}?filter=work_uri:${metricsConfig.settings.work_uri},measure_uri:${uri}`
    );

    // This function will call fetch() on all URIs provided as props
    fetchAllUrls(urls, res => {
      // This will merge all fetch() results into a single array, as if we only
      // made a single API request.
      // CHANGEME: In some cases, you may want to filter the array here to only contain results
      // that contain specific fields, such as `event_uri`. In this case, it may be worth
      // replacing the second `item` .filter function to be `item.event_uri` or equivalent
      const data = flattenArray(res).filter(item => item);

      // The data should then be manipulated, and a new datatype created to be
      // formatted in the way expected by the graph object.
      // CHANGEME: data.doSomethingHere()

      // Update the state with the formatted data
      setFormatted(null); // <-- CHANGEME: formatted data here

      // Tell the parent that we're ready
      onReady();
    });
  };

  // Called when component mounts, or the array of UIRs changes
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    // No URIs provided, or the tab was closed
    if (!uris || uris.length === 0) return setFormatted(null);

    // Go through each URI and fetch its data
    fetchURIs();

    // On component unmount
    return () => setFormatted(null);
  }, [uris]);

  if (hidden) return null;
  if (formatted)
    return (
      <CardWrapper
        label={getString('labels.by_country', { name: activeType })} // CHANGEME: The title to show above the graph
        // Note that some strings do not have an `activeType` interpolation (such as Wikipedia Articles not
        // needing one, but X by Type requiring interplation (such as Downloads by Type, Views by Type))
        // The `labels.by_country` is taken from the localisation file.
        width={width} // The width of the graph (straight from the props)
        hideLabel={hideLabel} // Whether we should hide the label (straight from the props)
        data-testid='world-map'
      >
        <p>Render the graph here!</p>
        {/* CHANGEME: This is where you will call the graph component, and provide the state data */}
      </CardWrapper>
    );
  return null;
};

WorldMap.propTypes = {
  uris: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeType: PropTypes.string.isRequired,
  hidden: PropTypes.bool,
  onReady: PropTypes.func,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  hideLabel: PropTypes.bool
};
WorldMap.defaultProps = {
  hidden: false,
  onReady: null,
  width: null,
  hideLabel: null
};

export default WorldMap;
