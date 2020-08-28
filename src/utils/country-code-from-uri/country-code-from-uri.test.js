import countryCodeFromURI from './country-code-from-uri';

const formatCode = code => `urn:iso:std:3166:-2:${code}`;

test('returns `null` if no URI is provided', () => {
  expect(countryCodeFromURI()).toBe(null);
});

test('returns `null` if URI is not a string', () => {
  expect(countryCodeFromURI({ abc: 'def' })).toBe(null);
});

test('returns correct country codes', () => {
  // format: urn:iso:std:3166:-2:XX
  expect(countryCodeFromURI(formatCode('CH'))).toBe('CH');
  expect(countryCodeFromURI(formatCode('IN'))).toBe('IN');
  expect(countryCodeFromURI(formatCode('UK'))).toBe('UK');
  expect(countryCodeFromURI(formatCode('SA'))).toBe('SA');
});
