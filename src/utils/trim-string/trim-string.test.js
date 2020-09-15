const { default: trimString } = require('./trim-string');

test('returns full string if length is less than trim', () => {
  expect(trimString('Hello', 10)).toBe('Hello');
  expect(trimString('Hello', 5)).toBe('Hello');
});

test('returns truncated string if length is more than trim', () => {
  expect(trimString('Hello', 1)).toBe('H...');
  expect(trimString('Good afternoon', 6)).toBe('Good a...');
});

test('returns correct direction of truncation', () => {
  global.metrics_config.locales = {
    en: { other: { trimmed_string: '...{{string}}' } }
  };
  expect(trimString('Hello', 1)).toBe('...H');
});

test('returns `null` if something goes wrong', () => {
  expect(trimString({ name: 'John' })).toBe(null);
});
