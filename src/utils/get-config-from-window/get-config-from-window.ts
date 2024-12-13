import type { UserConfig } from '@/types';

/**
 * Looks for `operas-metrics-config` in the `window` object and returns it.
 *
 * **NOTE**: Because the widget can be used as a React component, it accepts a `config` prop directly,
 * which is then stored and accessed via a context provider. Therefore, you should only call this function within
 * logic that is called _before_ the widget is rendered.
 *
 * In short, **only call this outside of the `src/widget` directory**.
 */
export const getConfigFromWindow = (): UserConfig => {
  try {
    if (typeof globalThis !== 'undefined') {
      const config = window['operas-metrics-config'];
      if (config) {
        try {
          return JSON.parse(config.textContent || '');
        } catch {
          throw new Error(
            'Found `operas-metrics-config`, but its content could not be parsed.'
          );
        }
      }
    }

    throw new Error('Could not find a script with ID `operas-metrics-config`.');
  } catch (err) {
    throw new Error((err as Error).message);
  }
};
