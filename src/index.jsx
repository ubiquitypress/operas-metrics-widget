import React from 'react';
import ReactDOM from 'react-dom';
import Widget from './components/widget/widget';
import getMetricsConfig from './utils/get-metrics-config/get-metrics-config';
import './styles/world-map.scss';

try {
  // Make sure a `metrics_config` variable exists
  if (!getMetricsConfig()) throw new Error();

  // Render the widget
  ReactDOM.render(<Widget />, document.getElementById('metrics-block'));
} catch (error) {
  // Throw the error to console
  console.error(error);

  // Tell the user that they are missing a configuration
  // NOTE: This will also be thrown if there is an uncaught exception, so this should be monitored..
  ReactDOM.render(
    <p>No configuration found - please check the documentation.</p>,
    document.getElementById('metrics-block')
  );
}
