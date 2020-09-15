import getTwitterIdFromURI from './get-twitter-id-from-uri';

const cb = uri => {
  return getTwitterIdFromURI(uri);
};

test('turns full URIs into IDs', () => {
  const tests = [
    {
      uri: 'https://twitter.com/i/web/status/896253444779982848',
      expected: '896253444779982848'
    },
    {
      uri: 'https://twitter.com/i/web/status/898602096827654144',
      expected: '898602096827654144'
    },
    {
      uri: 'https://twitter.com/i/web/status/898542814329528320',
      expected: '898542814329528320'
    }
  ];

  tests.forEach(t => expect(cb(t.uri)).toBe(t.expected));
});

test('turns direct URI formats into IDs', () => {
  const tests = [
    {
      uri: 'https://twitter.com/Interior/status/463440424141459456',
      expected: '463440424141459456'
    },
    {
      uri: 'https://twitter.com/WilliamShatner/status/495695865445486592',
      expected: '495695865445486592'
    },
    {
      uri: 'https://twitter.com/YosemiteNPS/status/1302396092957569032',
      expected: '1302396092957569032'
    }
  ];

  tests.forEach(t => expect(cb(t.uri)).toBe(t.expected));
});

test('does not modify direct ID arguments', () => {
  const tests = [
    '463440424141459456',
    '495695865445486592',
    '1302396092957569032'
  ];

  tests.forEach(t => expect(cb(t)).toBe(t));
});
