import type { Config, Graphs } from '@/types';
import { getAssetPath } from '@/utils';

export interface ExternalScript {
  id: string;
  url: string;
}

type GraphScripts = { [key in Graphs]: ExternalScript[] };

export const graphScripts = (config: Config): GraphScripts => {
  // A dictionary of all the external scripts that may be required
  const scripts: { [key: string]: ExternalScript } = {
    ChartJS: {
      id: 'mw-chartjs',
      url: getAssetPath('script', 'chartjs-4.1.2.umd.min.js', config)
    },
    JQuery: {
      id: 'mw-jquery',
      url: getAssetPath('script', 'jquery-3.6.3.min.js', config)
    },
    JVectorMapWorldMerc: {
      id: 'mw-jvectormap-world-merc',
      url: getAssetPath('script', 'jvectormap-world-merc.js', config)
    },
    JVectorMap: {
      id: 'mw-jvectormap',
      url: getAssetPath('script', 'jvectormap-2.0.5.min.js', config)
    },
    Twitter: {
      id: 'mw-twitter',
      url: getAssetPath('script', 'twitter.js', config)
    }
  };

  // Return the scripts required for each graph type
  // NB: The scripts are loaded in the order they are listed -- this is important for dependencies!
  return {
    text: [],
    line: [scripts.ChartJS],
    country_table: [],
    world_map: [
      scripts.JQuery,
      scripts.JVectorMap,
      scripts.JVectorMapWorldMerc
    ],
    hypothesis_table: [],
    tweets: [scripts.Twitter],
    list: []
  };
};
