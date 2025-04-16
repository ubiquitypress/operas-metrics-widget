import { cx } from '@/utils';
import React from 'react';
import type { TableRowProps } from '../row';
import { Row } from '../row';
import styles from './head.module.scss';

export interface TableHeadProps {
  children: React.ReactNode;
  className?: string;
}

export const Head = (props: TableHeadProps) => {
  const { children, className, ...rest } = props;

  // Pass `isHeader` through to any `Row` children
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child) && child.type === Row) {
      return React.cloneElement(child, {
        ...(typeof child.props === 'object' ? child.props : {}),
        isHeader: true
      } as TableRowProps);
    }
    return child;
  });

  return (
    <thead className={cx(styles['table-head'], className)} {...rest}>
      {childrenWithProps}
    </thead>
  );
};
