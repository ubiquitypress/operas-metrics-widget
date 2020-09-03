/* eslint-disable no-undef */
const getMetricsConfig = () => {
  if (metrics_config) return metrics_config;
  if (global && global.metrics_config) return global.metrics_config;
  return null;
};

export default getMetricsConfig;
