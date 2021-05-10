/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { graphPropTypes } from '../../proptypes';
import { useMetrics } from '../../contexts/metrics';
import GraphWrapper from '../graph-wrapper';
import { useTranslation } from '../../contexts/i18n';
import methods from './methods';
import { useConfig } from '../../contexts/config';
import KeyValueTable from '../graphs/key-value-table';
import Hypothesis from '../graphs/hypothesis';
import LineGraph from '../graphs/line-graph';
import WorldMap from '../graphs/world-map';

const Graph = ({ type, tab, options }) => {
  const [data, setData] = useState(null);
  const { fetchMetric } = useMetrics();
  const { t } = useTranslation();
  const config = useConfig();

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

      // Manipulate the graph data by calling its helper method
      if (methods[type]) uris = await methods[type]({ t, uris, tab, config });

      // Set the data
      setData(uris);
    };

    getData();
  }, []);

  if (!data) return null;

  // Determine the graph to render
  let graph = null;
  switch (type) {
    case 'world_map':
      graph = <WorldMap {...data} />;
      break;
    case 'time_graph':
      graph = <LineGraph {...data} />;
      break;
    case 'country_table':
    case 'wikipedia_articles':
    case 'wordpress':
      graph = <KeyValueTable {...data} />;
      break;
    case 'hypothesis':
      graph = <Hypothesis {...data} />;
      break;
    default:
      graph = <p>not implemented</p>;
  }
  return (
    <GraphWrapper
      width={options.width}
      label={t(`labels.${type.toLowerCase()}`, {
        name: t(`tabs.${tab.toLowerCase()}`)
      })}
      hideLabel={options.hide_label}
    >
      {graph}
    </GraphWrapper>
  );
};

Graph.propTypes = {
  type: PropTypes.string.isRequired,
  tab: PropTypes.string.isRequired,
  options: PropTypes.shape(graphPropTypes).isRequired
};

export default Graph;
