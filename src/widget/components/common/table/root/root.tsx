import { cx } from '@/utils';
import type React from 'react';
import styles from './root.module.scss';

export interface TableRootProps {
  children: React.ReactNode;
  className?: string;
}

export const Root = (props: TableRootProps) => {
  const { children, className, ...rest } = props;

  return (
    <table className={cx(styles.table, className)} {...rest}>
      {children}
    </table>
  );
};
