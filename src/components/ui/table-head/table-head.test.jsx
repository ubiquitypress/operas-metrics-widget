import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import TableHead from './table-head';

const render = (children = <></>) => {
  return {
    ...rtlRender(
      <table>
        <TableHead>{children}</TableHead>
      </table>
    )
  };
};

test('renders a thead component', () => {
  const { getByTestId } = render();
  const tableHead = getByTestId('table-head');

  expect(tableHead).toContainHTML('<thead');
});

test('renders children', () => {
  const { getByText } = render(
    <tr>
      <td>this is a child</td>
    </tr>
  );
  getByText('this is a child');
});
