import PropTypes from 'prop-types';
import getWidgetLanguage from '../../utils/get-widget-language/get-widget-language';
import en from '../en.json';
import getMetricsConfig from '../../utils/get-metrics-config/get-metrics-config';
import getPathFromObject from '../../utils/get-path-from-object/get-path-from-object';

const getString = (path, interpolations, languageOverride) => {
  // Get the language
  const language = languageOverride || getWidgetLanguage();

  // Make the dictionary depending on the chosen language
  // This should be updated every time a new language is added.
  let dict = {};
  switch (language) {
    case 'en':
    default:
      dict = en;
      break;
  }

  // Store the localised string
  let string = null;

  // Does an override locale exist?
  const { locales } = getMetricsConfig();
  if (locales && locales[language])
    string = getPathFromObject(locales[language], path);

  // Override locale does not exist, find it from the dictionary
  if (!string) {
    string = getPathFromObject(dict, path);
    if (!string && language !== 'en') string = getPathFromObject(en, path);
    if (!string) return path;
  }

  // Replace any provided interpolations
  if (interpolations) {
    Object.keys(interpolations).forEach(key => {
      string = string.replace(
        new RegExp(`{{${key}}}`, 'g'),
        interpolations[key]
      );
    });
  }

  // Return the localised string
  return string;
};

getString.defaultProps = {
  path: PropTypes.string.isRequired,
  interpolations: PropTypes.object,
  languageOverride: PropTypes.string
};

export default getString;
