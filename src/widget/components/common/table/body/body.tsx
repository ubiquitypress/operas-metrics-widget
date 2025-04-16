import type React from 'react';

export interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const Body = (props: TableBodyProps) => {
  const { children, ...rest } = props;

  return <tbody {...rest}>{children}</tbody>;
};
