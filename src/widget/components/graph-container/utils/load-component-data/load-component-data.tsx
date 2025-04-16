import {
  CountryTable,
  HypothesisTable,
  LineGraph,
  List,
  Text,
  Tweets,
  WorldMap
} from '@/components';
import type {
  Config,
  Graph,
  GraphData,
  Graphs,
  CountryTable as ICountryTable,
  HypothesisTable as IHypothesisTable,
  LineGraph as ILineGraph,
  List as IList,
  TextGraph as ITextGraph,
  Tweets as ITweets,
  WorldMap as IWorldMap,
  Tab
} from '@/types';
import { log } from '@/utils';
import type React from 'react';
import {
  mapCountryTableData,
  mapHypothesisData,
  mapLineGraphData,
  mapListData,
  mapTweetsData,
  mapWorldMapData
} from '../maps';

interface LoaderData<T> {
  id: string;
  graph: T;
  data: GraphData;
  tab: Tab;
  config: Config;
}

export interface ComponentData {
  Component: React.ReactNode;
  hasData: boolean;
}

type Loader = (data: LoaderData<any>) => ComponentData | Promise<ComponentData>;

// A map of graph types to their loader functions
const loader: Record<Graphs, Loader> = {
  text: ({ id, graph, data }: LoaderData<ITextGraph>) => {
    return {
      Component: <Text id={id} config={graph.config} data={data} />,
      hasData: true // there is no data to fetch for text graphs
    };
  },
  line: ({ id, data, graph, tab, config }: LoaderData<ILineGraph>) => {
    const res = mapLineGraphData(data, graph, tab, config);
    return {
      Component: (
        <LineGraph
          id={id}
          labels={res.labels}
          datasets={res.datasets}
          graph={graph}
        />
      ),
      hasData: res.datasets.length > 0
    };
  },
  country_table: ({ id, data, config }: LoaderData<ICountryTable>) => {
    const res = mapCountryTableData(data, config);
    return {
      Component: <CountryTable id={id} data={res} />,
      hasData: res.length > 0
    };
  },
  world_map: ({ id, data }: LoaderData<IWorldMap>) => {
    const res = mapWorldMapData(data);
    return {
      Component: <WorldMap id={id} data={res} />,
      hasData: Object.keys(res).length > 0
    };
  },
  hypothesis_table: async ({
    id,
    data,
    config
  }: LoaderData<IHypothesisTable>) => {
    const res = await mapHypothesisData(data, config);
    return {
      Component: <HypothesisTable id={id} data={res} />,
      hasData: res.length > 0
    };
  },
  tweets: ({ id, data, graph }: LoaderData<ITweets>) => {
    const res = mapTweetsData(data);
    return {
      Component: <Tweets id={id} data={res} graphId={graph.id} />,
      hasData: res.length > 0
    };
  },
  list: ({ id, data, graph }: LoaderData<IList>) => {
    const res = mapListData(data, graph);
    return {
      Component: <List id={id} data={res} />,
      hasData: res.length > 0
    };
  }
};

/**
 * Fetches data for a graph component and returns the component
 */
export const loadComponentData = (
  id: string,
  graph: Graph,
  data: GraphData,
  tab: Tab,
  config: Config
): ComponentData | Promise<ComponentData> => {
  try {
    return loader[graph.type]({ id, graph, data, tab, config });
  } catch (err) {
    log.error(`Failed to load data for "${graph.type}" graph`, err);
    return {
      Component: null,
      hasData: false
    };
  }
};
