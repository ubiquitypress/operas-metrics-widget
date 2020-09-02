import React from 'react';
import PropTypes from 'prop-types';
import styles from './key-value-table.module.scss';

const KeyValueTable = ({ data }) => {
  return (
    <ul className={styles.table} data-testid='key-value-table'>
      {data.map(item => (
        <li key={item.key}>
          <div className={styles.key}>{item.key}</div>
          <div className={styles.value}>{item.value}</div>
        </li>
      ))}
    </ul>
  );
};

KeyValueTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      value: PropTypes.string
    })
  ).isRequired
};

export default KeyValueTable;
