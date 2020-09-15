import React from 'react';
import PropTypes from 'prop-types';
import styles from './table-body.module.scss';

const TableBody = ({ children }) => {
  return (
    <tbody className={styles.tableBody} data-testid='table-body'>
      {children}
    </tbody>
  );
};

TableBody.propTypes = {
  children: PropTypes.node.isRequired
};

export default TableBody;
