import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import CardWrapper from './card-wrapper';

const render = (label, children = <></>, testId) => {
  return {
    ...rtlRender(
      <CardWrapper label={label} data-testid={testId}>
        {children}
      </CardWrapper>
    )
  };
};

test('renders a label with a heading if provided', () => {
  const { getByRole } = render('test');
  const label = getByRole('heading');
  expect(label).toContainHTML('test');
});

test('does not render a label if not provided', () => {
  const { queryByRole } = render();
  expect(queryByRole('heading')).not.toBeInTheDocument();
});

test('renders test-id prop is provided', () => {
  const { getByTestId } = render(null, <></>, 'card-wrapper');
  getByTestId('card-wrapper');
});

test('renders children', () => {
  const { getByText } = render(null, <p>Hello world</p>);
  getByText('Hello world');
});
