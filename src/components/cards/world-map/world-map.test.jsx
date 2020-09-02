import React from 'react';
import WorldMap from './world-map';
import { render as rtlRender, waitFor } from '@testing-library/react';
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
      <WorldMap
        uris={uris}
        activeType={activeType}
        onReady={onReady}
        hidden={hidden}
      />
    )
  };
};

test('renders a `world-map` on success', async () => {
  mockFetchSuccess({});
  const { getByTestId } = render();
  await waitFor(() => {
    getByTestId('world-map');
  });
});

test('does not render if `hidden`', async () => {
  mockFetchSuccess({});
  const { queryByTestId } = render({ hidden: true });
  await waitFor(() => {
    expect(queryByTestId('world-map')).not.toBeInTheDocument();
  });
});

test('does not render if no URIs are provided', async () => {
  const { queryByTestId } = render({ uris: [] });
  await waitFor(() => {
    expect(queryByTestId('world-map')).not.toBeInTheDocument();
  });
});

test('calls `onReady` when data is fetched', async () => {
  const onReady = jest.fn();
  const { getByTestId } = render({ onReady });

  expect(onReady).toHaveBeenCalledTimes(0);
  await waitFor(() => {
    getByTestId('world-map');
  });
  expect(onReady).toHaveBeenCalledTimes(1);
});

test.todo('error handling with mockFetchFailure');
