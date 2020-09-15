import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import TableRow from './table-row';

const render = (children = <></>) => {
  return {
    ...rtlRender(
      <table>
        <tbody>
          <TableRow>{children}</TableRow>
        </tbody>
      </table>
    )
  };
};

test('renders a tr component', () => {
  const { getByTestId } = render();
  const tableRow = getByTestId('table-row');

  expect(tableRow).toContainHTML('<tr');
});

test('renders children', () => {
  const { getByText } = render(<td>this is a child</td>);
  getByText('this is a child');
});
