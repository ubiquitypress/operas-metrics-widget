import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { configPropTypes } from '../../proptypes';

const ConfigContext = createContext({});

const ConfigProvider = ({ config, children }) => {
  const [configData] = useState(config);

  return (
    <ConfigContext.Provider value={{ ...configData }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);

ConfigProvider.propTypes = {
  config: PropTypes.shape(configPropTypes).isRequired,
  children: PropTypes.node.isRequired
};

export default ConfigProvider;
