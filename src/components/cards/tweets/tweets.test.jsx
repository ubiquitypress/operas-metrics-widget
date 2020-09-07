import React from 'react';
import { render as rtlRender, waitFor } from '@testing-library/react';
import Tweets from './tweets';
import { mockFetchSuccess } from '../../../__mocks__/mockFetch';

afterEach(() => {
  jest.clearAllMocks();
});
afterAll(() => {
  global.fetch.mockClear();
  delete global.fetch;
});

const render = ({ uris = ['a'], onReady = jest.fn(), hidden = false } = {}) => {
  return {
    ...rtlRender(<Tweets uris={uris} onReady={onReady} hidden={hidden} />)
  };
};

test('renders `tweets` on success', async () => {
  mockFetchSuccess([
    { event_uri: 'https://twitter.com/i/web/status/898542814329528320' }
  ]);
  const { getByTestId } = render();
  await waitFor(() => getByTestId('tweets'));
});

test('does not render if `hidden`', async () => {
  mockFetchSuccess([
    { event_uri: 'https://twitter.com/i/web/status/898542814329528320' }
  ]);
  const { queryByTestId } = render({ hidden: true });
  await waitFor(() => expect(queryByTestId('tweets')).not.toBeInTheDocument());
});

test('does not render if no URIs are provided', async () => {
  const { queryByTestId } = render({ uris: [] });
  await waitFor(() => expect(queryByTestId('tweets')).not.toBeInTheDocument());
});

test('calls `onReady` when data is fetched', async () => {
  const onReady = jest.fn();
  const { getByTestId } = render({ onReady });

  expect(onReady).toHaveBeenCalledTimes(0);
  await waitFor(() => getByTestId('tweets'));
  expect(onReady).toHaveBeenCalledTimes(1);
});

test.todo('error handling with mockFetchFailure');
