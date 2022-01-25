import React from 'react';
import {
  mockUseMetrics,
  render as rtlRender,
  waitFor,
  mockConfig
} from '../../utils/test-utils';
import Widget from './widget';
import MockLoading from '../loading/loading';

jest.mock('../loading/loading');

const render = () => {
  return { ...rtlRender(<Widget />) };
};

test('renders loading component on load', async () => {
  MockLoading.mockImplementation(() => null);
  render();

  await waitFor(() => expect(MockLoading).toHaveBeenCalledTimes(1));
});

test('does not render loading message if `settings.hide_initial_loading_screen` is true', async () => {
  MockLoading.mockImplementation(() => null);
  mockConfig.mockImplementation(() => ({
    settings: { hide_initial_loading_screen: true }
  }));
  render();

  await waitFor(() => expect(MockLoading).not.toHaveBeenCalled());
});

test('calls `fetchMetric` on load', async () => {
  const fetchMetric = jest.fn(() => {});
  mockUseMetrics.mockImplementation(() => ({ fetchMetric }));

  render();
  await waitFor(() => expect(fetchMetric).toHaveBeenCalledTimes(1));
  expect(fetchMetric).toHaveBeenCalledWith('&aggregation=measure_uri');
});
