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
  var Chart: {
    new (ctx: CanvasRenderingContext2D, config: any): any;
  };
}

export {};
