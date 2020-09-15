import React from 'react';
import PropTypes from 'prop-types';
import styles from './table.module.scss';

const Table = ({ children }) => {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table} data-testid='table'>
        {children}
      </table>
    </div>
  );
};

Table.propTypes = {
  children: PropTypes.node.isRequired
};

export default Table;
