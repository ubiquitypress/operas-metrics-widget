import React from 'react';
import { render as rtlRender, waitFor } from '@testing-library/react';
import TimeGraph from './time-graph';
import { mockFetchSuccess } from '../../../__mocks__/mockFetch';

afterEach(() => {
  jest.clearAllMocks();
});
afterAll(() => {
  global.fetch.mockClear();
  delete global.fetch;
});

const render = ({
  uris = ['a'],
  activeType = '',
  onReady = jest.fn(),
  hidden = false
} = {}) => {
  return {
    ...rtlRender(
      <TimeGraph
        uris={uris}
        activeType={activeType}
        onReady={onReady}
        hidden={hidden}
      />
    )
  };
};

test('renders a `time-graph` on success', async () => {
  mockFetchSuccess([{ timestamp: '2020-09-02T10:44:51.242Z', value: 12 }]);
  const { getByTestId } = render();
  await waitFor(() => {
    getByTestId('time-graph');
  });
});

test('does not render if `hidden`', async () => {
  mockFetchSuccess([{ timestamp: '2020-09-02T10:44:51.242Z', value: 12 }]);
  const { queryByTestId } = render({ hidden: true });
  await waitFor(() => {
    expect(queryByTestId('time-graph')).not.toBeInTheDocument();
  });
});

test('does not render if no URIs are provided', async () => {
  const { queryByTestId } = render({ uris: [] });
  await waitFor(() => {
    expect(queryByTestId('time-graph')).not.toBeInTheDocument();
  });
});

test('calls `onReady` when data is fetched', async () => {
  const onReady = jest.fn();
  const { getByTestId } = render({ onReady });

  expect(onReady).toHaveBeenCalledTimes(0);
  await waitFor(() => {
    getByTestId('time-graph');
  });
  expect(onReady).toHaveBeenCalledTimes(1);
});

test.todo('error handling with mockFetchFailure');
