import React from 'react';
import PropTypes from 'prop-types';
import styles from './graph-wrapper.module.scss';

const GraphWrapper = ({ width = 100, label, children }) => {
  return (
    <div className={styles['graph-wrapper']} style={{ width: `${width}%` }}>
      <h2 className={styles['graph-wrapper-label']}>{label}</h2>
      {children}
    </div>
  );
};

GraphWrapper.propTypes = {
  width: PropTypes.number,
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};
GraphWrapper.defaultProps = {
  width: 100
};

export default GraphWrapper;
