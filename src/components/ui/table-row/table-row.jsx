import React from 'react';
import PropTypes from 'prop-types';
import styles from './table-row.module.scss';

const TableRow = ({ children }) => {
  return (
    <tr className={styles.tableRow} data-testid='table-row'>
      {children}
    </tr>
  );
};

TableRow.propTypes = {
  children: PropTypes.node.isRequired
};

export default TableRow;
