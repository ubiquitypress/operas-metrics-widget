import React from 'react';
import {
  mockConfig,
  render as rtlRender,
  waitFor
} from '../../utils/test-utils';
import MockGraph from '../graph/graph';
import Panel from './panel';

jest.mock('../graph/graph');

const render = ({ name = 'downloads', active = true } = {}) => {
  return { ...rtlRender(<Panel name={name} active={active} />) };
};

test('renders an accessible panel', () => {
  mockConfig.mockImplementation(() => ({
    tabs: { downloads: { graphs: {} } }
  }));

  const { getByRole } = render();
  const panel = getByRole('tabpanel');
  expect(panel).toHaveAttribute('tabIndex', '0');
  expect(panel).toHaveAttribute('aria-labelledby');
});

test('renders the <Graph /> component for every graph object', async () => {
  MockGraph.mockImplementation(() => null);
  mockConfig.mockImplementation(() => ({
    tabs: { downloads: { graphs: { a: {}, b: {}, c: {} } } }
  }));

  expect(MockGraph).toHaveBeenCalledTimes(0);
  render();
  await waitFor(() => expect(MockGraph).toHaveBeenCalledTimes(3 * 2)); // 3 graphs, 2 renders
});
