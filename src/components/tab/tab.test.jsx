import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import Tab from './tab';
import { mockFetchSuccess } from '../../__mocks__/mockFetch';
import { act } from 'react-dom/test-utils';

afterEach(() => {
  jest.clearAllMocks();
});
afterAll(() => {
  global.fetch.mockClear();
  delete global.fetch;
});

const render = ({ activeType = '', onLoadingChange = jest.fn() } = {}) => {
  return {
    ...rtlRender(
      <Tab activeType={activeType} onLoadingChange={onLoadingChange} />
    )
  };
};

test('displays a message of no data on mount, if no data provided', async () => {
  mockFetchSuccess();
  const { getByTestId } = render();

  await act(async () => {
    getByTestId('no-data');
  });
});

test('renders each graph specified in `metrics-config`', async () => {
  mockFetchSuccess();
  const { getByTestId, queryByTestId } = render({ activeType: 'downloads' });

  // tests based on graphs provided in src/__mocks__/client.js
  await act(async () => {
    getByTestId('placeholder-country_table');
    getByTestId('placeholder-time_graph');
    expect(queryByTestId('placeholder-world_map')).not.toBeInTheDocument();
    expect(
      queryByTestId('placeholder-wikipedia_articles')
    ).not.toBeInTheDocument();
  });
});

test.todo('check that onLoadingChange is called');
