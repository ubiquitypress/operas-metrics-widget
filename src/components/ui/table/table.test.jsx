import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import Table from './table';

const render = (children = <></>) => {
  return {
    ...rtlRender(<Table>{children}</Table>)
  };
};

test('renders a table component', () => {
  const { getByTestId } = render();
  const table = getByTestId('table');

  expect(table).toContainHTML('<table');
});

test('renders children', () => {
  const { getByText } = render(
    <tbody>
      <tr>
        <td>this is a child</td>
      </tr>
    </tbody>
  );
  getByText('this is a child');
});
