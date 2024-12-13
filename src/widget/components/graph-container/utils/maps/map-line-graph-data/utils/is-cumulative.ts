import type { LineGraph } from '@/types';

export const isCumulative = (graph: LineGraph) => {
  return graph.config?.cumulative !== false;
};
