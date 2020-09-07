/* eslint-disable react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import styles from './button.module.scss';

const Button = ({ type = 'button', onClick, children }) => {
  return (
    <button className={styles.button} type={type} onClick={onClick}>
      {children}
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired
};
Button.defaultProps = {
  type: 'button',
  onClick: null
};

export default Button;
