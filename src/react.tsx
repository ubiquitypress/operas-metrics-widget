import type React from 'react';
import { Main } from './widget';
import type { EventsMap } from './widget/events';
import type {
  Config,
  Graph,
  GraphRowObject,
  Graphs,
  Scope,
  Tab,
  UserConfig
} from './widget/types';

export interface MetricsWidgetProps {
  /** Widget configuration object */
  config: UserConfig;
  /** Optional event callbacks (same names as script embed) */
  events?: Partial<EventsMap>;
  /** Optional id for the outer container */
  id?: string;
  /** Optional className for the outer container */
  className?: string;
  /** Optional ref for the outer container */
  containerRef?: React.Ref<HTMLDivElement>;
}

/**
 * React entrypoint for the metrics widget. Pass a UserConfig and handle the rest as a normal React component.
 */
export const MetricsWidget = ({
  config,
  events,
  id = 'metrics-widget',
  className,
  containerRef
}: MetricsWidgetProps) => (
  <div id={id} className={className} ref={containerRef}>
    <Main config={config} events={events} />
  </div>
);

export type { Config, Graph, GraphRowObject, Graphs, Scope, Tab, UserConfig };
