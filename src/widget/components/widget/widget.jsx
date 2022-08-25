import React, { useEffect, useState } from 'react';
import { useConfig } from '../../contexts/config';
import { useTranslation } from '../../contexts/i18n';
import { useMetrics } from '../../contexts/metrics';
import widgetEvent from '../../events/widget-event';
import deepFind from '../../utils/deep-find';
import Loading from '../loading';
import Navigation from '../navigation';
import Panel from '../panel';
import styles from './widget.module.scss';

const Widget = () => {
  const [data, setData] = useState({ loading: true, tabs: [], active: null });
  const { fetchMetric } = useMetrics();
  const { t } = useTranslation();
  const config = useConfig();

  // Sets the active tab
  const setTab = name =>
    setData({ ...data, active: name === data.active ? null : name });

  // Fetch the tabs on component mount
  useEffect(() => {
    const getTabs = async () => {
      try {
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
          let { count } = tab;

          // No measures for this tab, skip it
          if (!tab.nav_counts || !tab.nav_counts.length) {
            return tab;
          }

          // A wildcard is used, meaning we include all metrics of the given tab name
          // We don't return here incase other values are included too.
          if (tab.nav_counts.indexOf('*') !== -1) {
            const matches = measures.filter(m => m.type === tab.name);
            count += matches.reduce((a, b) => a + b.value, 0);
          }

          // The sources have been listed manually
          tab.nav_counts.forEach(uri => {
            if (uri !== '*') {
              const [match] = measures.filter(m => m.measure_uri === uri);
              count += match.value;
            }
          });

          return { ...tab, count };
        });

        // Remove empty tabs
        tabs = tabs.filter(tab => tab.count > 0);

        // Return the data
        setData({ ...data, loading: false, tabs });

        // Call the `widget_loaded` event with the tabs
        widgetEvent('widget_loaded', tabs);
      } catch (err) {
        // Hide the loading screen
        setData({ ...data, loading: false, tabs: [] });

        // Call the `widget_load_error` event with the tabs
        widgetEvent('widget_load_error', err);

        // Log the error
        console.error(err);
      }
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
    if (deepFind(config, 'settings.hide_initial_loading_screen')) return null;
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
