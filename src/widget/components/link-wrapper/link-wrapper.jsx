import React from 'react';
import PropTypes from 'prop-types';

const LinkWrapper = ({ href, children = <></> } = {}) => {
  if (!href) return children;

  return (
    <a href={href} target='_blank' rel='noopener noreferrer'>
      {children}
    </a>
  );
};

LinkWrapper.propTypes = {
  href: PropTypes.string,
  children: PropTypes.node
};
LinkWrapper.defaultProps = {
  href: null,
  children: null
};

export default LinkWrapper;
