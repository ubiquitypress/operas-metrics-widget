import PropTypes from 'prop-types';
import getWidgetLanguage from '../../utils/get-widget-language/get-widget-language';
import en from '../en.json';

const getString = (path, interpolations, languageOverride) => {
  // Choose the language
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

  // Find the localisation value
  try {
    const split = path.split('.');
    let marker = dict;
    split.forEach(item => {
      marker = marker[item];
    });
    if (!marker) return path;

    // Replace any provided interpolations
    if (interpolations) {
      Object.keys(interpolations).forEach(key => {
        marker = marker.replace(`{{${key}}}`, interpolations[key]);
      });
    }

    return marker;
  } catch (error) {
    return path;
  }
};

getString.defaultProps = {
  path: PropTypes.string.isRequired,
  interpolations: PropTypes.object,
  languageOverride: PropTypes.string
};

export default getString;
