import config from '../../../config.json';

const getVersion = () => {
  if (process.env.NODE_ENV === 'development') return 'dev';
  return config.app_version;
};

export default getVersion;
