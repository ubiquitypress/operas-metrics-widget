import React, { useEffect, useState } from 'react';

import { useConfig } from '../../contexts/config';
import { useTranslation } from '../../contexts/i18n';
import { useMetrics } from '../../contexts/metrics';
import deepFind from '../../utils/deep-find';
import Loading from '../loading';
import Navigation from '../navigation';
import Panel from '../panel';
import styles from './widget.module.scss';

const Widget = () => {
  const [data, setData] = useState({ loading: true, tabs: [], active: null });
  const config = useConfig();
  const { t } = useTranslation();
  const { fetchMetric } = useMetrics();

  // Sets the active tab
  const setTab = name =>
    setData({ ...data, active: name === data.active ? null : name });

  // Fetch the tabs on component mount
  useEffect(() => {
    const getTabs = async () => {
      // Fetch all of the possible measures available to us
      const measures = await fetchMetric('&aggregation=measure_uri');

      // Fetch and sort the tabs by their order
      let tabs = Object.entries(config.tabs || {}).map(([key, vals]) => {
        return {
          name: key,
          nav_counts: vals.nav_counts,
          order: vals.order,
          count: 0
        };
      });
      tabs.sort((a, b) => a.order - b.order);

      // Update the tabs with every measure
      tabs = tabs.map(tab => {
        // Set the count to be the total number of matching `nav_counts` metrics
        const count = measures.reduce((acc, curr) => {
          if (curr.type === tab.name)
            if (
              tab.nav_counts.indexOf('*') !== -1 ||
              tab.nav_counts.indexOf(curr.measure_uri) !== -1
            )
              return acc + curr.value;
          return acc;
        }, 0);
        return { ...tab, count };
      });

      // Remove empty tabs
      tabs = tabs.filter(tab => tab.count > 0);

      // Return the data
      setData({ ...data, loading: false, tabs });
    };

    getTabs();
  }, []);

  // Open the leftmost tab on ready, if specified
  useEffect(() => {
    if (!data.loading && data.tabs)
      if (deepFind(config, 'settings.first_panel_open_on_ready'))
        setTab(data.tabs[0].name);
  }, [data.tabs]);

  if (data.loading) {
    if (deepFind(config, 'settings.hide_loading_message')) return null;
    return <Loading message={t('loading.widget')} />;
  }
  return (
    <div className={styles.widget}>
      <Navigation tabs={data.tabs} active={data.active} setTab={setTab} />
      {data.tabs.map(tab => (
        <Panel
          key={tab.name}
          name={tab.name}
          active={data.active === tab.name}
        />
      ))}
    </div>
  );
};

export default Widget;
