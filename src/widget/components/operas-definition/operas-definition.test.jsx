import React from 'react';
import { render as rtlRender } from '../../utils/test-utils';
import OperasDefinition from './operas-definition';

const render = ({ link = null } = {}) => {
  return { ...rtlRender(<OperasDefinition link={link} />) };
};

test('does not render if `link` is null', () => {
  const { queryByTestId } = render();
  expect(queryByTestId('operas-definition')).not.toBeInTheDocument();
});

test('renders if `link` is not null', () => {
  const { getByTestId } = render({ link: 'https://google.com' });
  getByTestId('operas-definition');
});

test('renders link', () => {
  const href = 'https://my-definition-website.org';
  const { getByRole } = render({ link: href });

  const link = getByRole('link');
  expect(link).toHaveAttribute('href', href);
});
