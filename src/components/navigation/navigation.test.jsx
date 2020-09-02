import React from 'react';
import { render as rtlRender, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navigation from './navigation';
import { act } from 'react-dom/test-utils';
import { mockFetchSuccess } from '../../__mocks__/mockFetch';

afterEach(() => {
  jest.clearAllMocks();
});
afterAll(() => {
  global.fetch.mockClear();
  delete global.fetch;
});

const render = ({ activeType = '', onItemClick = jest.fn() } = {}) => {
  return {
    ...rtlRender(
      <Navigation activeType={activeType} onItemClick={onItemClick} />
    )
  };
};

test('renders loading on mount', async () => {
  mockFetchSuccess();
  const { getByTestId } = render();

  await act(async () => {
    getByTestId('loading');
  });
});

test('renders navigation menu', async () => {
  const data = [
    // `type` fields here must be declared in src/__mocks__/client.js
    { type: 'downloads', value: 1234 },
    { type: 'tweets', value: 456 }
  ];
  mockFetchSuccess(data);
  const { getByTestId } = render();

  await act(async () => getByTestId('loading')); // we need to wait for this first, for some reason
  await waitFor(async () => getByTestId('navigation'));
});

test('renders correct data from navigation menu', async () => {
  const data = [
    // `type` fields here must be declared in src/__mocks__/client.js
    { type: 'downloads', value: 123 },
    { type: 'tweets', value: 456 }
  ];
  mockFetchSuccess(data);
  const { getByTestId, getByText } = render();

  await act(async () => getByTestId('loading')); // we need to wait for this first, for some reason
  await waitFor(async () => getByTestId('navigation'));

  data.forEach(item => {
    getByText(item.type, { exact: false });
    getByText(item.value.toString());
  });
});

test('merges fields with same `type` together', async () => {
  const data = [
    // `type` fields here must be declared in src/__mocks__/client.js
    { type: 'downloads', value: 123 },
    { type: 'downloads', value: 456 },
    { type: 'tweets', value: 800 },
    { type: 'tweets', value: 100 }
  ];
  mockFetchSuccess(data);
  const { getByTestId, getByText } = render();

  await act(async () => getByTestId('loading')); // we need to wait for this first, for some reason
  await waitFor(async () => getByTestId('navigation'));

  getByText(/downloads/i);
  getByText((123 + 456).toString());
  getByText(/tweets/i);
  getByText((800 + 100).toString());
});

test('displays thousand separator if number is greater than 999', async () => {
  const data = [
    // `type` fields here must be declared in src/__mocks__/client.js
    { type: 'downloads', value: 12345 },
    { type: 'tweets', value: 112358132134 }
  ];
  mockFetchSuccess(data);
  const { getByTestId, getByText } = render();

  await act(async () => getByTestId('loading')); // we need to wait for this first, for some reason
  await waitFor(async () => getByTestId('navigation'));

  getByText(/downloads/i);
  getByText('12,345');
  getByText(/tweets/i);
  getByText('112,358,132,134');
});

test('onItemClick callback works', async () => {
  const onItemClick = jest.fn();

  const data = [
    // `type` fields here must be declared in src/__mocks__/client.js
    { type: 'downloads', value: 2 },
    { type: 'tweets', value: 5 }
  ];
  mockFetchSuccess(data);
  const { getByTestId, getByRole } = render({ onItemClick });

  await act(async () => getByTestId('loading')); // we need to wait for this first, for some reason
  await waitFor(async () => getByTestId('navigation'));

  expect(onItemClick).toHaveBeenCalledTimes(0);

  const tweetsBtn = getByRole('button', { name: '5 Tweets' });
  userEvent.click(tweetsBtn);

  expect(onItemClick).toHaveBeenCalledTimes(1);
});

test.todo('error handling');
