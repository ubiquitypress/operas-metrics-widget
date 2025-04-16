import { useEffect } from 'react';
import { Loading, Navigation, TabPanel, useNavigation } from './components';
import { useConfig } from './config';
import { useEvents } from './events';
import styles from './widget.module.scss';

export const Widget = () => {
  const { loading, tabs } = useNavigation();
  const { config } = useConfig();
  const events = useEvents();

  // Emit widget_loading event when the widget is mounted
  useEffect(() => {
    events.emit('widget_loading');
  }, [events]);

  // Emit widget_ready event when the widget is ready
  useEffect(() => {
    if (!loading) {
      events.emit('widget_ready', tabs);
    }
  }, [events, loading, tabs]);

  // Show loading indicator if data is not ready
  if (loading) {
    if (!config.options.hide_initial_loading_screen) {
      return config.components?.initial_loading_screen || <Loading />;
    }
    return null;
  }

  return (
    <div className={styles.widget}>
      <Navigation counts={tabs} />
      {config.tabs.map(tab => {
        // Only render the tab if it has counts
        const data = tabs.find(t => t.id === tab.id);
        if (!data?.counts) {
          return null;
        }

        return <TabPanel key={tab.id} tab={tab} />;
      })}
    </div>
  );
};
