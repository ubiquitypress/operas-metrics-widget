import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import TableCell from './table-cell';

const render = ({ isHead, isHidden, children = <></> }) => {
  return {
    ...rtlRender(
      <table>
        <tbody>
          <tr>
            <TableCell isHead={isHead} isHidden={isHidden}>
              {children}
            </TableCell>
          </tr>
        </tbody>
      </table>
    )
  };
};

test('renders as th if isHead is true', () => {
  const { getByTestId } = render({ isHead: true });
  const tableCell = getByTestId('table-cell');

  expect(tableCell).toContainHTML('<th');
});

test('renders as fd if isHead is false', () => {
  const { getByTestId } = render({ isHead: false });
  const tableCell = getByTestId('table-cell');

  expect(tableCell).toContainHTML('<td');
});

test('scope attribute is correct if isHead is true', () => {
  const { getByTestId } = render({ isHead: true });
  const tableCell = getByTestId('table-cell');

  expect(tableCell).toHaveAttribute('scope', 'col');
});

test('scope attribute is correct if isHead is false', () => {
  const { getByTestId } = render({ isHead: false });
  const tableCell = getByTestId('table-cell');

  expect(tableCell).toHaveAttribute('scope', 'row');
});

test('renders children', () => {
  const { getByText } = render({ children: <p>child</p> });
  getByText('child');
});
