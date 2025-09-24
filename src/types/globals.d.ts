import type { ChartConstructor } from '@/types';

declare global {
  /**
   * Requires the external script `Twitter` to be loaded.
   */
  var twttr: {
    widgets: {
      createTweet: (id: string, el: Element) => void;
    };
  };

  /**
   * Requires the external script `ChartJS` to be loaded.
   */
  var Chart: ChartConstructor;
}
