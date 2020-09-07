import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Loading from '../loading/loading';
import WorldMap from '../cards/world-map/world-map';
import TimeGraph from '../cards/time-graph/time-graph';
import CountryTable from '../cards/country-table/country-table';
import WikipediaArticles from '../cards/wikipedia-articles/wikipedia-articles';
import styles from './tab.module.scss';
import getString from '../../localisation/get-string/get-string';
import getMetricsConfig from '../../utils/get-metrics-config/get-metrics-config';
import Tweets from '../cards/tweets/tweets';

const Tab = ({ activeType, onLoadingChange }) => {
  const [graphs, setGraphs] = useState({});
  const [loading, setLoading] = useState({
    isLoading: false,
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

  // Called when the loading state changes
  useEffect(() => {
    if (
      loading.isLoading &&
      (loading.childrenLength === 0 ||
        loading.childrenLoaded === loading.childrenLength)
    )
      setLoading({ ...loading, isLoading: false });

    // Tell the parent <Widget /> that we are [not] loading
    onLoadingChange(loading.isLoading);
  }, [loading]);

  // Only re-calculate data when the activeType is changed
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    // No data if we toggle it closed
    if (!activeType) return setGraphs({});

    // Pull the configs from the `metrics_config`
    const metricsConfig = getMetricsConfig();
    const mcGraphs = metricsConfig.tabs[activeType].graphs;

    // Set the graphs in the object
    setGraphs(mcGraphs);

    // Update the loading state
    setLoading({
      ...loading,
      isLoading: true,
      childrenLength: Object.keys(mcGraphs).length,
      childrenLoaded: 0
    });
  }, [activeType]);

  // Make sure we have some graphs to render
  if (Object.keys(graphs).length > 0)
    return (
      <div data-testid='tab'>
        {loading.isLoading && <Loading message={getString('loading.graphs')} />}
        <ul className={styles.tab}>
          {Object.keys(graphs).map(name => {
            const uris = graphs[name];

            // Only render a placeholder div if we're testing, since we'll have
            // many different API calls made and it'll be impossible (and thankfully
            // unnecessary) to test all, since each component has its own unit test.
            if (process.env.NODE_ENV === 'test')
              return <div key={name} data-testid={`placeholder-${name}`} />;

            // Update this whenever new cards are added
            switch (name) {
              case 'world_map':
                return (
                  <li key={name}>
                    <WorldMap
                      uris={uris}
                      activeType={activeType}
                      onReady={onChildLoad}
                      hidden={loading.isLoading}
                    />
                  </li>
                );
              case 'time_graph':
                return (
                  <li key={name}>
                    <TimeGraph
                      uris={uris}
                      activeType={activeType}
                      onReady={onChildLoad}
                      hidden={loading.isLoading}
                    />
                  </li>
                );
              case 'country_table':
                return (
                  <li key={name}>
                    <CountryTable
                      uris={uris}
                      activeType={activeType}
                      onReady={onChildLoad}
                      hidden={loading.isLoading}
                    />
                  </li>
                );
              case 'wikipedia_articles':
                return (
                  <li key={name}>
                    <WikipediaArticles
                      uris={uris}
                      onReady={onChildLoad}
                      hidden={loading.isLoading}
                    />
                  </li>
                );
              case 'tweets':
                return (
                  <li key={name}>
                    <Tweets
                      uris={uris}
                      onReady={onChildLoad}
                      hidden={loading.isLoading}
                    />
                  </li>
                );
              default:
                return null;
            }
          })}
        </ul>
      </div>
    );

  // There is no graph data to display
  return (
    <p className={styles.noData} data-testid='no-data'>
      {getString('general.no_graphs')}
    </p>
  );
};

Tab.propTypes = {
  activeType: PropTypes.string,
  onLoadingChange: PropTypes.func
};
Tab.defaultProps = {
  activeType: null,
  onLoadingChange: null
};

export default Tab;
