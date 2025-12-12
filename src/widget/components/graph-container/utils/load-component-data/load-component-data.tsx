import {
  Citations,
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
  Citations as ICitations,
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
  mapCitationsData,
  mapCountryTableData,
  mapHypothesisData,
  mapLineGraphData,
  mapListData,
  mapTweetsData,
  mapWorldMapData
} from '../maps';

interface LoaderData<TGraph> {
  id: string;
  graph: TGraph;
  data: GraphData;
  tab: Tab;
  config: Config;
}

export interface ComponentData {
  Component: React.ReactNode;
  hasData: boolean;
}

type Loader<TGraph> = (
  data: LoaderData<TGraph>
) => ComponentData | Promise<ComponentData>;

const loadText: Loader<ITextGraph> = ({ id, graph, data }) => ({
  Component: <Text id={id} config={graph.config} data={data} />,
  hasData: true // there is no data to fetch for text graphs
});

const loadLine: Loader<ILineGraph> = ({ id, data, graph, tab, config }) => {
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
};

const loadCountryTable: Loader<ICountryTable> = ({ id, data, config }) => {
  const res = mapCountryTableData(data, config);
  return {
    Component: <CountryTable id={id} data={res} />,
    hasData: res.length > 0
  };
};

const loadWorldMap: Loader<IWorldMap> = ({ id, data, graph }) => {
  const res = mapWorldMapData(data);
  return {
    Component: <WorldMap id={id} data={res} graph={graph} />,
    hasData: Object.keys(res).length > 0
  };
};

const loadHypothesisTable: Loader<IHypothesisTable> = async ({
  id,
  data,
  config
}) => {
  const res = await mapHypothesisData(data, config);
  return {
    Component: <HypothesisTable id={id} data={res} />,
    hasData: res.length > 0
  };
};

const loadTweets: Loader<ITweets> = ({ id, data, graph }) => {
  const res = mapTweetsData(data);
  return {
    Component: <Tweets id={id} data={res} graphId={graph.id} />,
    hasData: res.length > 0
  };
};

const loadList: Loader<IList> = ({ id, data, graph }) => {
  const res = mapListData(data, graph);
  return {
    Component: <List id={id} data={res} />,
    hasData: res.length > 0
  };
};

const loadCitations: Loader<ICitations> = ({ id, data, graph }) => {
  const res = mapCitationsData(data);
  return {
    Component: (
      <Citations id={id} data={res.items} total={res.total} graph={graph} />
    ),
    hasData: res.items.length > 0
  };
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
    switch (graph.type) {
      case 'text':
        return loadText({ id, graph, data, tab, config });
      case 'line':
        return loadLine({ id, graph, data, tab, config });
      case 'country_table':
        return loadCountryTable({ id, graph, data, tab, config });
      case 'world_map':
        return loadWorldMap({ id, graph, data, tab, config });
      case 'hypothesis_table':
        return loadHypothesisTable({ id, graph, data, tab, config });
      case 'tweets':
        return loadTweets({ id, graph, data, tab, config });
      case 'list':
        return loadList({ id, graph, data, tab, config });
      case 'citations':
        return loadCitations({ id, graph, data, tab, config });
      default: {
        const _unreachable: never = graph;
        throw new Error('Unhandled graph type');
      }
    }
  } catch (err) {
    log.error(`Failed to load data for "${graph.type}" graph`, err);
    return {
      Component: null,
      hasData: false
    };
  }
};
