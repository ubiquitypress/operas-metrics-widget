import { useConfig } from '@/config';
import { useEvents } from '@/events';
import { useIntl } from '@/i18n';
import type { Graph, GraphRowObject, Tab } from '@/types';
import { cx } from '@/utils';
import { useEffect, useMemo, useState } from 'react';
import { GraphContainer } from '../graph-container';
import { useNavigation } from '../navigation';
import styles from './tab-panel.module.scss';

interface TabPanelProps {
  tab: Tab;
}

interface GraphRow {
  id?: GraphRowObject['id'];
  class?: GraphRowObject['class'];
  width: number;
  graphs: Graph[];
}

export const TabPanel = (props: TabPanelProps) => {
  const { tab } = props;
  const { t } = useIntl();
  const events = useEvents();
  const { config } = useConfig();
  const { activeTab } = useNavigation();
  const [state, setState] = useState({
    loading: tab.graphs.length > 0,
    remaining: tab.graphs.length || 0
  });

  const isActive = activeTab === tab.id;

  // When a graph is loaded, update the state
  const onGraphLoaded = () => {
    setState(state => ({
      ...state,
      loading: state.remaining > 1,
      remaining: state.remaining - 1
    }));
  };

  // Work out the rows based on the widths of the graphs
  const rows = useMemo(() => {
    const data: GraphRow[] = [];
    let currRow: GraphRow = { width: 0, graphs: [] };

    for (const graph of tab.graphs) {
      // Are we rendering a row instead?
      if ('graphs' in graph) {
        // First push any unfinished rows, if there are any
        if (currRow.width > 0) {
          data.push(currRow);
          currRow = { width: 0, graphs: [] }; // reset the data so it isn't duplicated
        }

        // Then push the row from the JSON data
        data.push({
          id: graph.id,
          class: graph.class,
          graphs: graph.graphs,
          width: 100 // it's a row, so will always be 100% width
        });
        continue;
      }

      // Get the width of the graph
      const width = graph.options?.width || config.options.default_graph_width;

      // Would the graph fit in the current row?
      if (currRow.width + width <= 100) {
        currRow.width += width;
        currRow.graphs.push(graph);
        continue;
      }

      // Start a new row
      data.push(currRow);
      currRow = { width, graphs: [graph] };
    }

    // Add the last row
    if (currRow.width > 0) {
      data.push(currRow);
    }

    // Return the data
    return data;
  }, [config.options.default_graph_width, tab.graphs]);

  // Send an event when the tab is loading
  useEffect(() => {
    const { load_graph_data_immediately } = config.options;
    if (state.loading && (isActive || load_graph_data_immediately)) {
      events.emit('tab_panel_loading', tab);
    }
  }, [tab, state.loading, isActive, config.options, events]);

  // Send an event when the tab is ready
  useEffect(() => {
    if (!state.loading) {
      events.emit('tab_panel_ready', tab);
    }
  }, [tab, state.loading, events]);

  return (
    <div
      id={`mw-tab-panel-${tab.id}`}
      tabIndex={isActive ? 0 : -1}
      role='tabpanel'
      aria-labelledby={`mw-tab-${tab.id}`}
      className={styles['tab-panel']}
      data-hidden={!isActive || undefined}
    >
      <div
        className={styles['tab-panel-loading']}
        data-hidden={!state.loading || undefined}
        aria-hidden={!state.loading || undefined}
      >
        {config.components?.tab_panel_loading_screen || t('loading')}
      </div>
      <div
        className={styles['tab-panel-rows']}
        data-hidden={!isActive || state.loading || undefined}
        aria-hidden={!isActive || state.loading || undefined}
      >
        {rows.map(row => {
          return (
            <div
              key={row.id}
              id={row.id}
              className={cx(styles['tab-panel-row'], row.class)}
            >
              {row.graphs.map(graph => {
                return (
                  <GraphContainer
                    key={graph.id}
                    graph={graph}
                    tab={tab}
                    onGraphLoaded={onGraphLoaded}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
