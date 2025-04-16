import { cx } from '@/utils';
import type React from 'react';
import styles from './cell.module.scss';

export interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  isHeader?: boolean;
}

interface Attribs {
  'data-type': string;
  scope?: string;
}

export const Cell = (props: TableCellProps) => {
  const { children, isHeader, className, ...rest } = props;

  // Determine which HTML element to use
  const Component = isHeader ? 'th' : 'td';

  // Get the scope attribute if this is a header cell
  const attribs: Attribs = {
    'data-type': isHeader ? 'th' : 'td',
    scope: isHeader ? 'col' : undefined
  };

  // Render the cell
  return (
    <Component
      className={cx(styles['table-cell'], className)}
      {...attribs}
      {...rest}
    >
      {children}
    </Component>
  );
};
