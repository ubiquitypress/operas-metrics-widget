import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { configPropTypes } from '../../proptypes';
import getLanguage from './get-language';
import deepFind from '../../utils/deep-find';

const I18nContext = createContext({});

const I18nProvider = ({ config, children }) => {
  const [data, setData] = useState({
    lang: undefined,
    dictionary: {}
  });

  useEffect(() => {
    setData({ ...data, ...getLanguage(config) });
  }, []);

  // Returns a translated string
  const t = (path, interpolations) => {
    // Get the value
    let str = deepFind(data.dictionary, path);
    if (!str) return path;

    // Apply any interpolations
    if (interpolations)
      Object.entries(interpolations).forEach(([key, value]) => {
        str = str.replace(new RegExp(`{{${key}}}`, 'g'), value);
      });

    // Return the string
    return str;
  };

  return (
    <I18nContext.Provider value={{ t, lang: data.lang }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => useContext(I18nContext);

I18nProvider.propTypes = {
  config: PropTypes.shape(configPropTypes).isRequired,
  children: PropTypes.node.isRequired
};

export default I18nProvider;
