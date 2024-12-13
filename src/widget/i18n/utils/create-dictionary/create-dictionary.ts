import type { Config } from '@/types';
import type { EncapsulatedStringObject } from '../to-dot-notation';
import { toDotNotation } from '../to-dot-notation';

export interface IntlDictionary {
  [key: string]: Record<string, string>;
}

// When adding new JSON locales, add them to this array
// NB: The fallback language MUST be the first item in this array (usually 'en-US')
// NBB: Because of how 2-character codes are imported, if a language has multiple locales,
// make sure the most common locale is first (e.g. 'en-US' before 'en-GB' before 'en-BZ').
export const locales = ['en-US'];

/**
 * Creates a dot-notation dictionary of all locales.
 *
 * If a locale exists as a 5-character code, and there is no 2-character version, the 5-character version
 * will also be added to the dictionary as a 2-character version (e.g. 'en-GB' will be added as 'en') if
 * there is no `en` locale.
 */
export const createDictionary = (config: Config): IntlDictionary => {
  const dictionary: IntlDictionary = {};

  // Loop through every `locales` file and add it to the dictionary
  for (const locale of locales) {
    // Import the locale file
    const data = require(`../../locales/${locale}.json`);

    // Convert the object to dot notation for much quicker lookups
    const dotNotation = toDotNotation(data);

    // Add the locale to the dictionary
    dictionary[locale] = dotNotation;

    // If the locale is five characters long, add the two-character version
    // if it doesn't already exist. If it exists LATER, it will overwrite this anyway.
    if (locale.length === 5) {
      const shortLocale = locale.slice(0, 2);

      if (!(shortLocale in dictionary)) {
        dictionary[shortLocale] = dotNotation;
      }
    }
  }

  // Add in any custom locales or overrides
  for (const locale of Object.keys(config.locales)) {
    dictionary[locale] = toDotNotation(
      config.locales[locale] as EncapsulatedStringObject
    );
  }

  return dictionary;
};
