import React, { useState } from 'react';
import Navigation from '../navigation/navigation';
import styles from './widget.module.scss';
import useFetch from '../../hooks/use-fetch';
import Tab from '../tab/tab';

const Widget = () => {
  const [tab, setTab] = useState(null);

  // TODO: should we move this data into the navbar itself, now that it is not being used by any other component?
  const events = useFetch(
    `${metrics_config.settings.base_url}?filter=work_uri:${metrics_config.settings.work_uri}&aggregation=measure_uri`
  );

  const ToggleTab = newTab => {
    setTab(newTab === tab ? null : newTab);
  };

  // TODO: Add actual UI here
  if (events.loading) return <p>loading</p>;
  if (events.error) return <p>{events.error}</p>;

  return (
    <div className={styles.widget}>
      <Navigation
        events={events.data}
        activeType={tab}
        onItemClick={ToggleTab}
      />
      <Tab activeType={tab} />
    </div>
  );
};

export default Widget;
