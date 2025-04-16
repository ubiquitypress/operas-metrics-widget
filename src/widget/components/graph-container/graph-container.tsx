import { graphDefaults, graphScripts, useConfig } from '@/config';
import { useEvents } from '@/events';
import type { Graph, Tab } from '@/types';
import { cx, log } from '@/utils';
import { useEffect, useState } from 'react';
import { useNavigation } from '../navigation';
import { GraphTitle } from './components';
import styles from './graph-container.module.scss';
import type { ComponentData } from './utils';
import { loadComponentData, loadData, loadScripts } from './utils';

interface GraphContainerProps {
  graph: Graph;
  tab: Tab;
  onGraphLoaded?: () => void;
}
interface GraphContainerState {
  loading: boolean;
  ready: boolean;
  componentData: ComponentData | null;
}

export const GraphContainer = (props: GraphContainerProps) => {
  const { graph, tab, onGraphLoaded } = props;
  const events = useEvents();
  const { config } = useConfig();
  const { activeTab } = useNavigation();
  const [state, setState] = useState<GraphContainerState>({
    loading: false,
    ready: false,
    componentData: null
  });

  // Load the scripts when this is active
  useEffect(() => {
    const prepare = async () => {
      try {
        // Don't load if the data is already loaded
        if (state.loading || state.ready) {
          return;
        }

        // Don't load if the tab is not active, unless the option is enabled
        const { load_graph_data_immediately } = config.options;
        if (!load_graph_data_immediately && activeTab !== tab.id) {
          return;
        }

        // Set the loading state
        setState({ ...state, loading: true });

        // Trigger the loading event
        events.emit('graph_loading', graph, tab);

        // Make sure the graph type is valid
        if (!(graph.type in graphDefaults)) {
          throw new Error(`Graph of type "${graph.type}" is not supported`);
        }

        // Fetch and load any external scripts needed to load this graph
        const scripts = graphScripts(config)[graph.type];
        await loadScripts(scripts);

        // Load the graph data from the OPERAS API
        const data = await loadData(tab, graph, config);

        // Map the graph data into a React component
        const id = `${tab.id}-${graph.id}`;
        const componentData = await loadComponentData(
          id,
          graph,
          data,
          tab,
          config
        );

        // Call the callback
        if (onGraphLoaded) {
          onGraphLoaded();
        }

        // Trigger the ready event
        events.emit('graph_ready', graph, tab);

        // Set the ready state and pass in the graph
        setState({ ...state, loading: false, ready: true, componentData });
      } catch (err) {
        log.error(err instanceof Error ? err.message : err);
      }
    };

    prepare().catch(log.error);
  }, [
    activeTab,
    config,
    events,
    graph,
    onGraphLoaded,
    state,
    state.loading,
    state.ready,
    tab,
    tab.id
  ]);

  // This component won't be rendered until the data is ready
  if (!state.ready || !state.componentData) {
    return null;
  }

  // We have the data, render the graph
  return (
    <div
      className={cx(styles['graph-container'], graph.id, graph.options?.class)}
      style={{
        width: `${graph.options?.width || config.options.default_graph_width}%`,
        height: state.componentData.hasData
          ? graph.options?.height || graphDefaults[graph.type].height
          : undefined, // no data, so don't set a height
        maxHeight:
          graph.options?.maxHeight || graphDefaults[graph.type].maxHeight
      }}
    >
      {graph.title && <GraphTitle>{graph.title}</GraphTitle>}

      <div
        className={styles.graph}
        style={{ overflowY: graphDefaults[graph.type].overflowY }}
      >
        {state.componentData.Component}
      </div>
    </div>
  );
};
