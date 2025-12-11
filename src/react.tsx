import { Main } from './widget';
import type {
  Config,
  Graph,
  Graphs,
  Scope,
  Tab,
  UserConfig
} from './widget/types';

export interface MetricsWidgetProps {
  config: UserConfig;
}

/**
 * React entrypoint for the metrics widget. Pass a UserConfig and handle the rest as a normal React component.
 */
export const MetricsWidget = ({ config }: MetricsWidgetProps) => (
  <Main config={config} />
);

export type { UserConfig, Config, Graph, Graphs, Scope, Tab };
