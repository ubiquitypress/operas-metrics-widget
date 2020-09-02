import useFetch from './use-fetch';
import { renderHook, act } from '@testing-library/react-hooks';
import { mockFetchSuccess, mockFetchFailure } from '../__mocks__/mockFetch';

afterEach(() => {
  jest.clearAllMocks();
});
afterAll(() => {
  global.fetch.mockClear();
  delete global.fetch;
});

test('makes a HTTP request', async () => {
  mockFetchSuccess();
  await act(async () => {
    renderHook(() => useFetch('https://mysite.com'));
  });

  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenCalledWith('https://mysite.com');
});

test('updates state on success', async () => {
  const resData = { name: 'John Smith' };
  mockFetchSuccess(resData);

  let hook;
  await act(async () => {
    hook = renderHook(useFetch);
  });
  const { current } = hook.result;

  expect(current.loading).toBe(false);
  expect(current.data).toBe(resData);
  expect(current.error).toBe(null);
});

test('updates state on failure', async () => {
  const resError = 'server error';
  mockFetchFailure(resError);

  let hook;
  await act(async () => {
    hook = renderHook(useFetch);
  });
  const { current } = hook.result;

  expect(current.loading).toBe(false);
  expect(current.data).toBe(null);
  expect(current.error).toBe(resError);
});

test('retry function makes new request', async () => {
  mockFetchFailure('server error');

  let hook;
  await act(async () => {
    hook = renderHook(useFetch);
  });
  const { current } = hook.result;

  await act(async () => {
    current.retry();
  });

  expect(global.fetch).toHaveBeenCalledTimes(2);
});
