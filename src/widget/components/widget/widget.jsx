import React, { useEffect, useState } from 'react';

import { useConfig } from '../../contexts/config';
import { useTranslation } from '../../contexts/i18n';
import { useMetrics } from '../../contexts/metrics';
import Loading from '../loading';
import Navigation from '../navigation';
import Panel from '../panel';

const Widget = () => {
  const [data, setData] = useState({ loading: true, tabs: {}, active: null });
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
      let measures = await fetchMetric('&aggregation=measure_uri');

      // Pull the tabs from the config
      const tabs = Object.keys(config.tabs);

      // Remove any measures that we haven't listed as a tab
      measures = measures.filter(measure => tabs.indexOf(measure.type) !== -1);

      // Remove anything not listed in `nav_counts`
      measures = measures.filter(measure => {
        const navCounts = config.tabs[measure.type].nav_counts;
        return (
          navCounts.indexOf('*') !== -1 ||
          navCounts.indexOf(measure.measure_uri) !== -1
        );
      });

      // Aggregate the measures
      const aggregate = {};
      measures.forEach(measure => {
        aggregate[measure.type] = aggregate[measure.type]
          ? aggregate[measure.type] + measure.value
          : measure.value;
      });

      setData({ ...data, loading: false, tabs: aggregate });
    };

    getTabs();
  }, []);

  if (data.loading) return <Loading message={t('loading.widget')} />;
  return (
    <>
      <Navigation tabs={data.tabs} active={data.active} setTab={setTab} />
      {Object.keys(data.tabs).map(tab => (
        <Panel key={tab} name={tab} active={data.active === tab} />
      ))}
    </>
  );
};

export default Widget;
