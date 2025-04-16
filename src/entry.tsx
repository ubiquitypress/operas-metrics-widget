import { initWindowEvents } from '@/events/utils';
import { getRootElement, log } from '@/utils';
import { createRoot } from 'react-dom/client';
import { getConfigFromWindow } from './utils';
import { Main } from './widget';

try {
  // Pull the widget configuration from the DOM
  const config = getConfigFromWindow();

  // Get the root element
  const root = getRootElement(config);

  // Cache any events that have been fired before the widget is loaded
  initWindowEvents();

  // Render the widget
  if (root) {
    createRoot(root).render(<Main config={config} />);
  } else {
    throw new Error('No root element found.');
  }
} catch (err) {
  log.error(`Error loading widget: ${(err as Error).message}`);
}
