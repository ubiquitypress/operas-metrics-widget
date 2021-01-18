import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import OperasDefinition from './operas-definition';

const render = ({ uris = ['a'], onReady = jest.fn(), hidden = false } = {}) => {
  return {
    ...rtlRender(
      <OperasDefinition uris={uris} onReady={onReady} hidden={hidden} />
    )
  };
};

test('renders `operas-definition` on success', async () => {
  const { getByTestId } = render();
  getByTestId('operas-definition');
});

test('renders with correct properties', async () => {
  const { getByRole } = render({ uris: ['https://google.com'] });
  const link = getByRole('link');

  expect(link).toHaveAttribute('href', 'https://google.com');
  expect(link).toHaveAttribute('rel', 'noopener noreferrer');
});

test('does not render if `hidden`', async () => {
  const { queryByTestId } = render({ hidden: true });
  expect(queryByTestId('time-graph')).not.toBeInTheDocument();
});

test('does not render if no URIs are provided', async () => {
  const { queryByTestId } = render({ uris: [] });
  expect(queryByTestId('time-graph')).not.toBeInTheDocument();
});
