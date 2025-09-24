import type { Event, EventsMap } from '@/events';
import type { ChartConstructor } from '@/types';

interface OperasWidgetEvents {
  on: <T extends Event>(event: T, callback: EventsMap[T]) => void;
  off: <T extends Event>(event: T, callback: EventsMap[T]) => void;
}

export interface OperasWidget {
  eventQueue: Array<(widget: OperasWidget) => void>;
  events: OperasWidgetEvents;
}

declare global {
  interface Window {
    // The global config object
    'operas-metrics-config': HTMLElement | null;

    // The <script> tag added by users embedding the widget
    operaswidget?: OperasWidget;

    // Script-based widgets (eg. Twitter) need to be able to access the global window object
    Chart: ChartConstructor;
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
