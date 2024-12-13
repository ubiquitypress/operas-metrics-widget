import { DEFAULT_ELEMENT_ID } from '@/config';
import type { Config, UserConfig } from '@/types';

/**
 * Get the root element of the widget.
 * @param config - The user config.
 * @returns The root element of the widget.
 */
export const getRootElement = (config: UserConfig | Config): Element | null => {
  const id = config.settings?.element_id || DEFAULT_ELEMENT_ID;

  return document.querySelector(`#${id}`);
};
