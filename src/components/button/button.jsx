/* eslint-disable react/button-has-type */
import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import styles from './button.module.scss';

const Button = ({ type = 'button', onClick, className, children }) => {
  return (
    <button
      className={classnames(styles.button, className)}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};
Button.defaultProps = {
  type: 'button',
  onClick: null,
  className: null
};

export default Button;
