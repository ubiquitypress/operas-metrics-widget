import React from 'react';
import PropTypes from 'prop-types';
import ConfigProvider from './contexts/config';
import Widget from './components/widget';
import MetricsProvider from './contexts/metrics';
import I18nProvider from './contexts/i18n';
import { configPropTypes } from './proptypes';
import './polyfills';

const Main = ({ config }) => {
  return (
    <ConfigProvider config={config}>
      <MetricsProvider config={config}>
        <I18nProvider config={config}>
          <Widget />
        </I18nProvider>
      </MetricsProvider>
    </ConfigProvider>
  );
};

Main.propTypes = {
  config: PropTypes.shape(configPropTypes).isRequired
};

export default Main;
