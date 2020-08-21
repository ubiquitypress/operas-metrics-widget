import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import WorldMap from '../cards/world-map/world-map';
import TimeGraph from '../cards/time-graph/time-graph';
import CountryTable from '../cards/country-table/country-table';

const Tab = ({ activeType }) => {
  const [graphs, setGraphs] = useState({});
  const [loading, setLoading] = useState({
    isLoading: true,
    childrenLength: 0,
    childrenLoaded: 0
  });

  // Called when a child loads
  const onChildLoad = () => {
    setLoading(prevState => ({
      ...prevState,
      childrenLoaded: prevState.childrenLoaded + 1
    }));
  };

  useEffect(() => {
    if (
      loading.childrenLength > 0 &&
      loading.childrenLoaded === loading.childrenLength &&
      loading.isLoading
    ) {
      setLoading({ ...loading, isLoading: false });
    }
  }, [loading]);

  // Only re-calculate data when the activeType is changed
  useEffect(() => {
    // No data if we toggle it closed
    if (!activeType) return setGraphs({});

    // Pull the configs from the `metrics_config`
    const graphs = metrics_config.tabs[activeType].graphs;

    // Set the graphs in the object
    setGraphs(graphs);
    setLoading({ ...loading, childrenLength: Object.keys(graphs).length });
  }, [activeType]);

  // Make sure we have some graphs to render
  if (Object.keys(graphs).length > 0)
    return (
      <div>
        {loading.isLoading && <p>Loading this data...</p>}
        {Object.keys(graphs).map(name => {
          const uris = graphs[name];

          // Update this whenever new cards are added
          switch (name) {
            case 'world_map':
              return (
                <WorldMap
                  key={name}
                  uris={uris}
                  onReady={onChildLoad}
                  hidden={loading.isLoading}
                />
              );
            case 'time_graph':
              return (
                <TimeGraph
                  key={name}
                  uris={uris}
                  onReady={onChildLoad}
                  hidden={loading.isLoading}
                />
              );
            case 'country_table':
              return (
                <CountryTable
                  key={name}
                  uris={uris}
                  onReady={onChildLoad}
                  hidden={loading.isLoading}
                />
              );
          }

          // No matching cards are found
          return null;
        })}
      </div>
    );
  return null;
};

Tab.propTypes = {
  activeType: PropTypes.string
};

export default Tab;
