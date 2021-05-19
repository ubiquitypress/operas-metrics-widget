import React from 'react';
import ReactDOM from 'react-dom';
import Widget from './widget';

// Pull the config from the environment

const config =
  typeof metrics_config !== 'undefined'
    ? // eslint-disable-next-line no-undef
      metrics_config
    : window.metrics_config;

// Render the widget
ReactDOM.render(
  <Widget config={config} />,
  document.getElementById('metrics-block')
);
