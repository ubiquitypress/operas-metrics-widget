import getString from './get-string';

test('returns string', () => {
  expect(getString('tabs.tweets')).toBe('Tweets');
});

test('returns overriden string', () => {
  global.metrics_config.locales = { en: { tabs: { tweets: 'Twitters' } } };
  expect(getString('tabs.tweets')).toBe('Twitters');
});

test('returns string in different language', () => {
  global.metrics_config.locales = { it: { tabs: { tweets: 'tweeter' } } };
  expect(getString('tabs.tweets')).toBe('Tweets'); // English
  expect(getString('tabs.tweets', {}, 'it')).toBe('tweeter'); // Italian
});

test('returns English localisation if provided one does not exist', () => {
  global.metrics_config.locales = { it: { tabs: { tweets: undefined } } };
  expect(getString('tabs.tweets', {}, 'it')).toBe('Tweets');
});

test('returns the path if no string is found in English', () => {
  expect(getString('tabs.doesNotExist')).toBe('tabs.doesNotExist'); // English
  expect(getString('tabs.doesNotExist', {}, 'it')).toBe('tabs.doesNotExist'); // Italian
});

test('correctly interpolates strings', () => {
  global.metrics_config.locales = {
    en: {
      tabs: {
        tweets: '{{number}} Tweets',
        downloads: 'There are {{amount}} {{name}}',
        citations: '{{name}} {{name}}'
      }
    }
  };
  expect(getString('tabs.tweets', { number: 109 })).toBe('109 Tweets');
  expect(getString('tabs.downloads', { amount: 6, name: 'Downloads' })).toBe(
    'There are 6 Downloads'
  );
  expect(getString('tabs.citations', { name: 'Citations' })).toBe(
    'Citations Citations'
  );
});
