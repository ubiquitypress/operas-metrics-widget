import type { Config } from '@/types';
import { parseToRgb } from 'polished';
import { getRootElement } from '../get-root-element';
import { log } from '../log';

/**
 * Searches through the styles of the widget's root element for the given CSS variable.
 * If an array is provided, the first valid style will be returned.
 *
 * If no styles are found, `undefined` will be returned.
 *
 * If a style is found but isn't valid, it will be skipped and a warning will be logged.
 * The `skipValidationCheck` option can be used to skip this check, but it is not recommended.
 */
export const getWidgetStyle = (
  style: string | string[],
  config: Config,
  options: { skipValidationCheck?: boolean } = {}
) => {
  const { skipValidationCheck } = options;

  // If `style` is not an array, make it an array
  const styles = Array.isArray(style) ? style : [style];

  // Get the widget
  const widget = getRootElement(config);

  // If the widget is not found, return undefined
  if (!widget) {
    return;
  }

  // Get the computed style of the widget
  const computedStyle = getComputedStyle(widget);

  // Loop through the styles and return the first one that is not `undefined`
  for (const style of styles) {
    // Make sure the style starts with `--`
    const name = style.startsWith('--') ? style : `--${style}`;

    // Get the value of the style
    const value = computedStyle.getPropertyValue(name) || '';
    const color = value.trim();
    if (color) {
      // Make sure the colour is valid
      if (!skipValidationCheck) {
        try {
          parseToRgb(color);
          return color;
        } catch {
          log.warn(
            `CSS variable \`${style}\` has an invalid value "${color}" -- skipping`
          );
          continue;
        }
      }

      // Skip validation check
      return color;
    }
  }
};
