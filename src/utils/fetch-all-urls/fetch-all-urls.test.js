import fetchAllUrls from './fetch-all-urls';
import '@testing-library/react';

afterEach(() => {
  jest.clearAllMocks();
});
afterAll(() => {
  global.fetch.mockClear();
  delete global.fetch;
});

test('returns null as callback if argument is not an array', () => {
  fetchAllUrls('1234', cb => expect(cb).toBe(null));
  fetchAllUrls(1234, cb => expect(cb).toBe(null));
  fetchAllUrls({ 12: '34' }, cb => expect(cb).toBe(null));
});

test('returns all API responses as an array', () => {
  const resData = { name: 'John Smith', age: '22' };
  global.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve({ data: resData })
    })
  );

  const urls = ['http://abc.com', 'https://def.uk', 'http://geh.org'];
  fetchAllUrls(urls, cb => {
    expect(Array.isArray(cb)).toBe(true);
    expect(cb.length).toBe(urls.length);
    cb.forEach(item => expect(item).toStrictEqual(resData));
  });
  expect(global.fetch).toHaveBeenCalledTimes(urls.length);
});

test.todo('handle errors better - replace cb(data) to be cb(err, data)');
