import React from 'react';
import { render as rtlRender, waitFor } from '@testing-library/react';
import Hypothesis from './hypothesis';
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
    ...rtlRender(<Hypothesis uris={uris} onReady={onReady} hidden={hidden} />)
  };
};

test('renders a `hypothesis` on success', async () => {
  mockFetchSuccess({});
  const { getByTestId } = render();
  await waitFor(() => {
    getByTestId('hypothesis');
  });
});

test.todo('renders data on success');

test('does not render if `hidden`', async () => {
  mockFetchSuccess({});
  const { queryByTestId } = render({ hidden: true });
  await waitFor(() => {
    expect(queryByTestId('hypothesis')).not.toBeInTheDocument();
  });
});

test('does not render if no URIs are provided', async () => {
  const { queryByTestId } = render({ uris: [] });
  await waitFor(() => {
    expect(queryByTestId('hypothesis')).not.toBeInTheDocument();
  });
});

test('calls `onReady` when data is fetched', async () => {
  const onReady = jest.fn();
  const { getByTestId } = render({ onReady });

  expect(onReady).toHaveBeenCalledTimes(0);
  await waitFor(() => {
    getByTestId('hypothesis');
  });
  expect(onReady).toHaveBeenCalledTimes(1);
});

test.todo('error handling with mockFetchFailure');
