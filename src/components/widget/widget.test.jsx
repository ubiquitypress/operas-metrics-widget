import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Widget from './widget';
import { act } from 'react-dom/test-utils';
import { mockFetchSuccess } from '../../__mocks__/mockFetch';

const render = () => {
  return { ...rtlRender(<Widget />) };
};

test('renders navigation on mount', () => {
  const { getByRole } = render();
  getByRole('navigation');
});

test('renders tab when user clicks on navigation', async () => {
  mockFetchSuccess([{ type: 'downloads', value: 123 }]);
  const { getByTestId, getByRole, queryByRole } = render();

  await act(async () => getByTestId('loading'));
  await act(async () => getByTestId('navigation'));
  expect(queryByRole('tab')).not.toBeInTheDocument();

  const downloadsBtn = getByRole('button', { name: '123 Downloads' });
  userEvent.click(downloadsBtn);
  await act(async () => getByTestId('tab'));
});

test('clicking on the same navigation button twice will close the tab', async () => {
  mockFetchSuccess([{ type: 'downloads', value: 123 }]);
  const { getByTestId, getByRole, queryByRole } = render();
  await act(async () => getByTestId('loading'));
  await act(async () => getByTestId('navigation'));
  const downloadsBtn = getByRole('button', { name: '123 Downloads' });
  userEvent.click(downloadsBtn);
  await act(async () => getByTestId('tab'));

  userEvent.click(downloadsBtn);
  await act(async () => expect(queryByRole('tab')).not.toBeInTheDocument());
});

test('user cannot change tabs whilst data is loading', async () => {
  mockFetchSuccess([{ type: 'downloads', value: 123 }]);
  const { getByTestId, getByRole } = render();
  await act(async () => getByTestId('loading'));
  await act(async () => getByTestId('navigation'));
  const downloadsBtn = getByRole('button', { name: '123 Downloads' });

  userEvent.click(downloadsBtn);
  mockFetchSuccess();

  await act(async () => getByTestId('tab'));
  userEvent.click(downloadsBtn);
  await act(async () => getByTestId('tab'));
});
