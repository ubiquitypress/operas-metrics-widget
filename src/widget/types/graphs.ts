import type { APIEvent } from './api';

// Union type of all graph types
export type Graphs = Graph['type'];

// The graph data passed into a tab
export interface GraphRowObject {
  id?: string;
  class?: string;
  graphs: Graph[];
}
export type GraphTab = Graph[] | GraphRowObject[];

export type Graph =
  | TextGraph
  | LineGraph
  | CountryTable
  | WorldMap
  | HypothesisTable
  | Tweets
  | List;

interface BaseGraph {
  id: string;
  type: Graphs;
  scopes?: string[];
  title?: string;
  options?: {
    width?: number;
    height?: string;
    maxHeight?: string;
    class?: string;
  };
}
export interface TextGraph extends BaseGraph {
  type: 'text';
  config: {
    content: string;
    variable_regex?: string;
    html_support?: 'none' | 'safe' | 'unsafe';
  };
}
export interface LineGraph extends BaseGraph {
  type: 'line';
  config?: {
    cumulative?: boolean;
    stacked?: boolean;
    range?: 'auto' | 'days' | 'months' | 'years';
    artificial_zero?: boolean;
    begin_at_zero?: boolean;
    background?: 'gradient' | 'fill' | 'none';
    border_width?: number;
  };
}
export interface CountryTable extends BaseGraph {
  type: 'country_table';
}
export interface WorldMap extends BaseGraph {
  type: 'world_map';
}
export interface HypothesisTable extends BaseGraph {
  type: 'hypothesis_table';
}
export interface Tweets extends BaseGraph {
  type: 'tweets';
}
export interface List extends BaseGraph {
  type: 'list';
  config?: {
    name_regex?: string;
    name_replacements?: {
      [key: string]: string;
    };
  };
}

export interface GraphData {
  total: number;
  data: {
    [key: string]: {
      total: number;
      data: APIEvent[];
    };
  };
  merged: APIEvent[];
}

export interface Dataset {
  label?: string;
  data: number[];
}

export type DatasetRange = 'days' | 'months' | 'years';
