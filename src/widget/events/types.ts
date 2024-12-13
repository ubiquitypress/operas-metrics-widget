import type { Graph, NavCount, Tab } from '@/types';

// Contains the arguments each event receives and passes to its callbacks
// This is the only part of this file that needs to be modified when adding a new event
export interface EventArgs {
  widget_loading: [];
  widget_ready: [tabs: NavCount[]];

  tab_panel_loading: [tab: Tab];
  tab_panel_ready: [tab: Tab];

  graph_loading: [graph: Graph, tab: Tab];
  graph_ready: [graph: Graph, tab: Tab];
}

// Contains all the event names; doesn't need to be modified
export type Event = keyof EventArgs;

// Contains the state of all the events; doesn't need to be modified
export type EventState = {
  [K in keyof EventArgs]?: ((...args: EventArgs[K]) => void)[];
};

// Helper type to map the event names to their arguments; doesn't need to be modified
export type EventsMap = {
  [K in keyof EventArgs]: (...args: EventArgs[K]) => void;
};
