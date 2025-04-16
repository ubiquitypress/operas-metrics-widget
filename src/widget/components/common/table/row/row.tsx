import { cx } from '@/utils';
import React from 'react';
import type { TableCellProps } from '../cell';
import { Cell } from '../cell';
import styles from './row.module.scss';

export interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  isHeader?: boolean;
}

export const Row = (props: TableRowProps) => {
  const { children, isHeader, className, ...rest } = props;

  // Pass `isHeader` through to any `Cell` children
  const childrenWithProps = React.Children.map(children, child => {
    if (isHeader && React.isValidElement(child) && child.type === Cell) {
      return React.cloneElement(child, {
        ...(typeof child.props === 'object' ? child.props : {}),
        isHeader: true
      } as TableCellProps);
    }
    return child;
  });

  return (
    <tr className={cx(styles['table-row'], className)} {...rest}>
      {childrenWithProps}
    </tr>
  );
};
