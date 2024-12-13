import type { ExternalScript } from '@/config';
import { getState, setState } from './utils';

/**
 * Load an external script and resolve the promise when it's loaded.
 * @param script - The external script to load.
 * @returns A promise that resolves when the script is loaded.
 */
export const loadExternalScript = async (
  script: ExternalScript
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const { id, url } = script;

    // Check if the script has already been loaded before
    const existing = document.querySelector(`#${id}`);
    if (existing && getState(existing) === 'loaded') {
      resolve();
      return;
    }

    // Create a new script element if it doesn't exist
    let el: HTMLScriptElement = existing as HTMLScriptElement;
    if (!existing) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'text/javascript';
      el.src = url;
      el.referrerPolicy = 'no-referrer';
      document.head.append(el);
    }

    // Set the script state to loading
    setState(el, 'loading');

    // Wait for the script to load before resolving the promise
    el.addEventListener('load', () => {
      setState(el, 'loaded');
      resolve();
    });

    // If the script fails to load, reject the promise
    el.addEventListener('error', () => {
      reject(new Error(`Failed to load script: ${url}`));
    });
  });
};
