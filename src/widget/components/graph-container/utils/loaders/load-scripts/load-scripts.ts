import type { ExternalScript } from '@/config';
import { loadExternalScript } from '@/utils';

/**
 * Loads each script in the array of scripts, in order.
 * @param scripts - The array of scripts to load.
 */
export const loadScripts = async (scripts: ExternalScript[]) => {
  for (const script of scripts) {
    await loadExternalScript(script);
  }
};
