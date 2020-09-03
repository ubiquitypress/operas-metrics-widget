import React from 'react';
import { render as rtlRender, waitFor } from '@testing-library/react';
import WikipediaArticles from './wikipedia-articles';
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
      <WikipediaArticles
        uris={uris}
        activeType={activeType}
        onReady={onReady}
        hidden={hidden}
      />
    )
  };
};

test('renders `wikipedia-articles` on success', async () => {
  mockFetchSuccess({});
  const { getByTestId } = render();
  await waitFor(() => {
    getByTestId('wikipedia-articles');
  });
});

test('renders data on success', async () => {
  const res = [
    {
      event_uri: 'https://en.wikipedia.org/wiki/Wilhelm_scream',
      expected: 'Wilhelm scream' // this field does not exist in the API response; only used for testing
    },
    {
      event_uri:
        'https://en.wikipedia.org/wiki/List_of_helicopter_prison_escapes',
      expected: 'List of helicopter prison escapes' // this field does not exist in the API response; only used for testing
    },
    {
      event_uri: 'https://en.wikipedia.org/wiki/List_of_Crayola_crayon_colors',
      expected: 'List of Crayola crayon colors' // this field does not exist in the API response; only used for testing
    },
    {
      event_uri: 'https://en.wikipedia.org/wiki/List_of_lists_of_lists',
      expected: 'List of lists of lists' // this field does not exist in the API response; only used for testing
    }
  ];
  mockFetchSuccess(res);
  const { getByText, getByTestId } = render();

  await waitFor(() => {
    getByTestId('wikipedia-articles');
  });

  res.forEach(res2 => getByText(res2.expected));
});

test('does not render if `hidden`', async () => {
  mockFetchSuccess({});
  const { queryByTestId } = render({ hidden: true });
  await waitFor(() => {
    expect(queryByTestId('wikipedia-articles')).not.toBeInTheDocument();
  });
});

test('does not render if no URIs are provided', async () => {
  const { queryByTestId } = render({ uris: [] });
  await waitFor(() => {
    expect(queryByTestId('wikipedia-articles')).not.toBeInTheDocument();
  });
});

test('calls `onReady` when data is fetched', async () => {
  const onReady = jest.fn();
  const { getByTestId } = render({ onReady });

  expect(onReady).toHaveBeenCalledTimes(0);
  await waitFor(() => {
    getByTestId('wikipedia-articles');
  });
  expect(onReady).toHaveBeenCalledTimes(1);
});

test.todo('error handling with mockFetchFailure');
