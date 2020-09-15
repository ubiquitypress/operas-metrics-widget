import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import TableBody from './table-body';

const render = (children = <></>) => {
  return {
    ...rtlRender(
      <table>
        <TableBody>{children}</TableBody>
      </table>
    )
  };
};

test('renders a tbody component', () => {
  const { getByTestId } = render();
  const tableBody = getByTestId('table-body');

  expect(tableBody).toContainHTML('<tbody');
});

test('renders children', () => {
  const { getByText } = render(
    <tr>
      <td>this is a child</td>
    </tr>
  );
  getByText('this is a child');
});
