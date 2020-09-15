import React from 'react';
import PropTypes from 'prop-types';
import styles from './table-head.module.scss';

const TableHead = ({ children }) => {
  return (
    <thead className={styles.tableHead} data-testid='table-head'>
      {children}
    </thead>
  );
};

TableHead.propTypes = {
  children: PropTypes.node.isRequired
};

export default TableHead;
