import type React from 'react';
import { createContext, useContext, useState } from 'react';
import type { Event, EventArgs, EventState, EventsMap } from '../types';
import { getWindowEvents } from '../utils';

interface EventsProviderProps {
  children: React.ReactNode;
}

interface EventsContextProps {
  emit: <T extends Event>(event: Event, ...args: EventArgs[T]) => void;
  on: <T extends Event>(event: Event, callback: EventsMap[T]) => void;
  off: <T extends Event>(event: Event, callback: EventsMap[T]) => void;
}

const EventsContext = createContext<EventsContextProps>({
  emit: () => null,
  on: () => null,
  off: () => null
});

export const EventsProvider = (props: EventsProviderProps) => {
  const { children } = props;
  const [events, setEvents] = useState<EventState>({});

  // Trigger an event
  const emit = <T extends Event>(event: T, ...args: EventArgs[T]) => {
    // Run events stored in the state
    for (const callback of events[event] || []) {
      callback(...args);
    }

    // Run events stored in the window
    const windowEvents = getWindowEvents<T>(event);
    if (windowEvents) {
      for (const callback of windowEvents) {
        callback(...args);
      }
    }
  };

  // Subscribe to an event
  const on = <T extends Event>(event: T, callback: EventsMap[T]) => {
    setEvents(e => ({ ...e, [event]: [...(e[event] || []), callback] }));
  };

  // Unsubscribe from an event
  const off = <T extends Event>(event: T, callback: EventsMap[T]) => {
    setEvents(e => ({
      ...e,
      [event]: (e[event] || []).filter(c => c !== callback)
    }));
  };

  return (
    <EventsContext.Provider value={{ emit, on, off }}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => useContext(EventsContext);
