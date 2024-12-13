import type { GraphTab } from './graphs';

export interface Scope {
  title?: string;
  works: string[];
  measures: string[];
  startDate?: string;
  endDate?: string;
}

export interface Tab {
  id: string;
  name: string;
  order?: number;
  scopes: Record<string, Scope>;
  graphs: GraphTab;
}
