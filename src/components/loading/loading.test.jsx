import React from 'react';
import { render } from '@testing-library/react';
import Loading from './loading';

test('renders with correct aria properties', () => {
  const { getByRole } = render(<Loading />);
  const loading = getByRole('alert');
  expect(loading).toHaveAttribute('aria-busy', 'true');
});

test('renders a message', () => {
  const { getByRole } = render(<Loading />);
  expect(getByRole('alert')).not.toBeEmptyDOMElement();
});
