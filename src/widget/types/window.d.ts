import type { Event, EventsMap } from '@/events';

declare global {
  interface Window {
    // The global config object
    'operas-metrics-config': HTMLElement | null;

    // The <script> tag added by users embedding the widget
    operaswidget?: {
      // added in the user's widget <script> tag
      eventQueue: ((widget: any) => void)[];

      // added by `get-window-events.ts`
      events: {
        on: <T extends Event>(event: T, callback: EventsMap[T]) => void;
        off: <T extends Event>(event: T, callback: EventsMap[T]) => void;
      };
    };

    // Script-based widgets (eg. Twitter) need to be able to access the global window object
    Chart: () => void;
    $: (selector: string) => {
      vectorMap: (options: object) => void;
    };
    twttr: {
      widgets: {
        createTweet: (id: string, element: HTMLElement) => void;
      };
    };
  }
}
