import deepFind from '../../utils/deep-find';
import mergeDeep from '../../utils/merge-deep/merge-deep.test';
import getLanguageFile from './get-language-file';

const getLanguage = config => {
  // Pull the user's chosen language, or default to 'en'
  let lang = (deepFind(config, 'settings.language') || 'en').toLowerCase();

  // Get the dictionary for the closest language
  let dictionary = getLanguageFile(lang);

  // The provided lang didn't exist, does a 2-code version?
  if (!dictionary && lang.indexOf('-') !== -1) {
    const [split] = lang.split('-');
    dictionary = getLanguageFile(split);
    if (dictionary) {
      lang = split;
    }
  }

  // No close versions found, let's revert to 'en'
  if (!dictionary) {
    dictionary = getLanguageFile('en');
    lang = 'en';
  }

  // Merge any overrides
  const overrides = deepFind(config, `locales.${lang}`);
  if (overrides) dictionary = mergeDeep(dictionary, overrides);

  // Return the results
  return { lang, dictionary };
};

export default getLanguage;
