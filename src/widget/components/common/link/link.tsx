import type React from 'react';

interface LinkProps {
  href: string;
  children: React.ReactNode;
}

export const Link = (props: LinkProps) => {
  const { href, children, ...rest } = props;

  return (
    <a href={href} target='_blank' rel='noopener noreferrer' {...rest}>
      {children}
    </a>
  );
};
