import type React from 'react';
import styles from './title.module.scss';

interface GraphTitleProps {
  children: React.ReactNode;
}

export const GraphTitle = (props: GraphTitleProps) => {
  const { children } = props;

  return <div className={styles['graph-title']}>{children}</div>;
};
