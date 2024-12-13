import type { Config } from '@/types';
import { log } from '@/utils';
import type { IntlDictionary } from '../create-dictionary';
import { locales } from '../create-dictionary';

// This is a function that logs a warning message to the console if
// the preferred language is not found in the dictionary.
const logFallback = (
  preferred: string | undefined,
  fallback: string,
  config: Config
) => {
  if (!preferred) {
    return;
  }

  let message = `Language "${preferred}" not found in config.locales, falling back to "${fallback}".`;
  if (config.options.locale_fallback_type === 'mixed') {
    message += `\nDue to config setting "locale_fallback_type" being set to "mixed", the widget will display in "${fallback}" but will use "${preferred}" for browser-localised strings.`;
  }
  log.warn(message);
};

/**
 * Returns the language the widget will be displayed in
 */
export const getLang = (dictionary: IntlDictionary, config: Config) => {
  const configLang = config.settings.locale;

  // If the widget has specified a language, use that if it exists
  if (configLang && configLang in dictionary) {
    return configLang;
  }

  // Is the configLang a five-character language code?
  if (configLang && configLang.length === 5) {
    // If so, try the two-character version
    const shortLang = configLang.slice(0, 2);

    if (shortLang in dictionary) {
      return shortLang;
    }
  }

  // If the user's language is supported, use that
  if (navigator.language in dictionary) {
    logFallback(configLang, navigator.language, config);
    return navigator.language;
  }

  // Resort to the first locale in the array
  logFallback(configLang, locales[0], config);
  return locales[0];
};
