import React from 'react';
import { cx } from '@/utils';
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
  // eslint-disable-next-line sonarjs/function-return-type
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
