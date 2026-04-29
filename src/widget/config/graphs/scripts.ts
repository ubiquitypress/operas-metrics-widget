import type { ChartConstructor, Config, Graphs } from '@/types';

export type GraphScriptLoader = { [key in Graphs]: () => Promise<void> };

/**
 * Lazy loaders for third-party libraries used by specific graphs.
 * Each loader only runs when the graph type is rendered.
 */
export const graphScripts = (_config: Config): GraphScriptLoader => {
  return {
    text: async () => undefined,
    line: async () => {
      const chartModule = await import('chart.js/auto');
      const Chart =
        (chartModule as { default?: ChartConstructor }).default ||
        (chartModule as { Chart?: ChartConstructor }).Chart;
      if (Chart) {
        (globalThis as typeof globalThis & { Chart?: ChartConstructor }).Chart =
          Chart;
      }
    },
    country_table: async () => undefined,
    world_map: async () => undefined,
    hypothesis_table: async () => undefined,
    tweets: async () => {
      const twitterWidgets = await import('twitter-widgets');
      const load =
        (
          twitterWidgets as {
            load?: (callback?: (error?: Error) => void) => void;
          }
        ).load ||
        (
          twitterWidgets as {
            default?: { load?: (callback?: (error?: Error) => void) => void };
          }
        ).default?.load;

      if (!load) {
        return;
      }

      await new Promise<void>((resolve, reject) => {
        load(error => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    },
    list: async () => undefined,
    citations: async () => undefined
  };
};
