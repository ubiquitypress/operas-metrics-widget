import countryCodeFromURI from '../../../utils/country-code-from-uri';

const worldMap = ({ uris, tab }) => {
  // Pull the country codes from each item
  const countryCodes = {};
  uris.forEach(({ country_uri, value }) => {
    const code = countryCodeFromURI(country_uri);
    if (code)
      countryCodes[code] = countryCodes[code]
        ? countryCodes[code] + value
        : value;
  });

  // Return the country codes
  return { data: { tab, values: countryCodes } };
};

export default worldMap;
