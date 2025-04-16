import { WINDOW_WIDGET_NAME } from '@/config';
import type { Event, EventState } from '@/events';

// Stores a cache of all events set in the window object
let events: EventState | null = null;

/**
 * Called by the Events provider every time an event.on() is fired
 * to add the callback to the global window object
 */
export const getWindowEvents = <T extends Event>(
  event: Event
): EventState[T] => {
  return (events ? events[event] : []) as EventState[T];
};

export const initWindowEvents = () => {
  const widget = window[WINDOW_WIDGET_NAME];
  if (!widget) {
    return;
  }

  // Initialise the events object
  events = {};

  // Add the events object to the window object
  widget.events = {
    on: (event, callback) => {
      if (!events) {
        return;
      }
      if (events[event]) {
        events[event].push(callback);
      } else {
        events[event] = [callback] as EventState[typeof event];
      }
    },
    off: (event, callback) => {
      if (!events || !events[event]) {
        return;
      }
      events[event] = events[event].filter(
        cb => cb.toString() !== callback.toString()
      ) as EventState[typeof event];
    }
  };

  // Run any queued events
  for (const event of widget.eventQueue) {
    event(widget);
  }
};
