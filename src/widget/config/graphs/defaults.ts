import type { Graphs } from '@/types';
import type { Property } from 'csstype';

interface Data {
  height?: string;
  maxHeight?: string;
  overflowY?: Property.OverflowY;
}

export const graphDefaults: Record<Graphs, Data> = {
  text: {
    height: undefined
  },
  line: {
    height: '250px'
  },
  country_table: {
    height: '250px',
    overflowY: 'auto'
  },
  world_map: {
    height: '250px'
  },
  hypothesis_table: {
    height: '250px',
    overflowY: 'auto'
  },
  tweets: {
    height: '250px',
    overflowY: 'auto'
  },
  list: {
    height: undefined,
    maxHeight: '250px',
    overflowY: 'auto'
  }
};
