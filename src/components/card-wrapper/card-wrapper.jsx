import React from 'react';
import PropTypes from 'prop-types';
import styles from './card-wrapper.module.scss';

const CardWrapper = ({ label, children, 'data-testid': testId }) => {
  return (
    <div className={styles.cardWrapper} data-testid={testId}>
      {label && <h2>{label}</h2>}
      {children}
    </div>
  );
};

export default CardWrapper;

CardWrapper.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node.isRequired,
  testId: PropTypes.string
};
