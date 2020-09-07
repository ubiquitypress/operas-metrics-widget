import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './navigation.module.scss';
import getString from '../../localisation/get-string/get-string';
import useFetch from '../../hooks/use-fetch';
import getMetricsConfig from '../../utils/get-metrics-config/get-metrics-config';

const Navigation = ({ activeType, onItemClick }) => {
  const [navItems, setNavItems] = useState({});
  const { loading, data } = useFetch(
    `${getMetricsConfig().settings.base_url}?filter=work_uri:${
      getMetricsConfig().settings.work_uri
    }&aggregation=measure_uri`
  );

  // Called when the component mounts
  useEffect(() => {
    if (data) {
      const metricsConfig = getMetricsConfig();

      // Get all event categories as keys in `metrics_config`
      const categories = Object.keys(metricsConfig.tabs);

      // Remove API results that are not marked as categories
      const filtered = data.filter(
        item => categories.indexOf(item.type) !== -1
      );

      // Remove filtered items that are not listed in the `nav_counts`
      const items = {};
      categories.forEach(category => {
        const navCounts = metricsConfig.tabs[category].nav_counts;

        // Loop through each URI provided in the `nav_counts` object
        navCounts.forEach(uri => {
          filtered.forEach(event => {
            // We count this event's value as long as it is the right category, and
            // the `measure_uri` field is provided in the `metrics_config` object.
            // The latter condition is overruled if an asterisk is found instead.
            if (
              event.type === category &&
              (event.measure_uri === uri || uri === '*')
            ) {
              items[category] = items[category]
                ? items[category] + event.value
                : event.value;
            }
          });
        });

        // Update the state
        setNavItems(items);
      });
    }
  }, [data]);

  // Handler for when a button is clicked to change tab
  const onButtonClick = type => {
    onItemClick(type);
  };

  if (loading)
    return (
      <div className={styles.loading} data-testid='loading'>
        <p>{getString('loading.loading_widget')}</p>
      </div>
    );
  if (navItems) {
    return (
      <nav className={styles.navigation} data-testid='navigation'>
        <ul>
          {Object.keys(navItems).map(type => (
            <li key={type}>
              <button
                type='button'
                onClick={() => onButtonClick(type)}
                className={classnames({
                  [styles.active]: activeType === type
                })}
              >
                <div className={styles.count}>
                  {navItems[type].toLocaleString()}
                </div>
                <div className={styles.label}>{getString(`tabs.${type}`)}</div>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
  return null;
};

Navigation.propTypes = {
  activeType: PropTypes.string,
  onItemClick: PropTypes.func.isRequired
};
Navigation.defaultProps = {
  activeType: null
};

export default Navigation;
