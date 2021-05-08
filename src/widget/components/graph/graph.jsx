import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { graphPropTypes } from '../../proptypes';
import { useMetrics } from '../../contexts/metrics';
import Loading from '../loading';

const Graph = ({ type, options }) => {
  const [data, setData] = useState(null);
  const { fetchMetric } = useMetrics();

  useEffect(() => {
    const getData = async () => {
      // Fetch all URIs
      let uris = [];
      await Promise.all(
        options.uris.map(async uri => {
          uris.push(await fetchMetric(`,measure_uri:${uri}`));
        })
      );
      uris = uris.reduce((acc, curr) => [...acc, ...curr], []);

      // Manipulate the graph data
      // TODO

      // Set the data
      setData(uris);
    };

    getData();
  }, []);

  if (!data) return <Loading />;
  return null;
};

Graph.propTypes = {
  type: PropTypes.string.isRequired,
  options: PropTypes.shape(graphPropTypes).isRequired
};

export default Graph;
