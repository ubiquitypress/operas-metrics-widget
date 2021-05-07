/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const getLanguageFile = lang => {
  try {
    return require(`../../localisation/${lang}.json`);
  } catch (err) {
    return null;
  }
};

export default getLanguageFile;
