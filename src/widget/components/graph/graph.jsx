import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { graphPropTypes } from '../../proptypes';
import { useMetrics } from '../../contexts/metrics';
import Loading from '../loading';
import GraphWrapper from '../graph-wrapper';
import { useTranslation } from '../../contexts/i18n';

const Graph = ({ type, tab, options }) => {
  const [data, setData] = useState(null);
  const { fetchMetric } = useMetrics();
  const { t } = useTranslation();

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

  console.log(options);

  if (!data) return <Loading />;
  return (
    <GraphWrapper
      width={options.width}
      label={t(`labels.${tab}`, { name: tab.toLowerCase() })}
    >
      graph here
    </GraphWrapper>
  );
};

Graph.propTypes = {
  type: PropTypes.string.isRequired,
  tab: PropTypes.string.isRequired,
  options: PropTypes.shape(graphPropTypes).isRequired
};

export default Graph;
