import React from 'react';
import CountryTable from './country-table';
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
      <CountryTable
        uris={uris}
        activeType={activeType}
        onReady={onReady}
        hidden={hidden}
      />
    )
  };
};

test('renders a `country-table` on success', async () => {
  mockFetchSuccess({});
  const { getByTestId } = render();
  await waitFor(() => {
    getByTestId('country-table');
  });
});

test('renders data on success', async () => {
  const res = [
    { country_uri: 'GB', value: 12 },
    { country_uri: 'IT', value: 19 },
    { country_uri: 'FR', value: 8 },
    { country_uri: 'US', value: 22 }
  ];
  mockFetchSuccess(res);
  const { getByText, getByTestId } = render();

  await waitFor(() => {
    getByTestId('country-table');
  });

  res.forEach(res => {
    getByText(res.country_uri);
    getByText(res.value.toString());
  });
});

test('does not render if `hidden`', async () => {
  mockFetchSuccess({});
  const { queryByTestId } = render({ hidden: true });
  await waitFor(() => {
    expect(queryByTestId('country-table')).not.toBeInTheDocument();
  });
});

test('does not render if no URIs are provided', async () => {
  const { queryByTestId } = render({ uris: [] });
  await waitFor(() => {
    expect(queryByTestId('country-table')).not.toBeInTheDocument();
  });
});

test('calls `onReady` when data is fetched', async () => {
  const onReady = jest.fn();
  const { getByTestId } = render({ onReady });

  expect(onReady).toHaveBeenCalledTimes(0);
  await waitFor(() => {
    getByTestId('country-table');
  });
  expect(onReady).toHaveBeenCalledTimes(1);
});

test.todo('error handling with mockFetchFailure');
