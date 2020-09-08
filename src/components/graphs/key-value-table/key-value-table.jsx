import React from 'react';
import PropTypes from 'prop-types';
import styles from './key-value-table.module.scss';

const KeyValueTable = ({ data }) => {
  return (
    <ul className={styles.table} data-testid='key-value-table'>
      {data.map(item => (
        <li key={item.key}>
          <div className={styles.key}>
            {item.keyLink ? (
              <a href={item.keyLink} target='_blank' rel='noopener noreferrer'>
                {item.key}
              </a>
            ) : (
              item.key
            )}
          </div>
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
      value: PropTypes.string,
      link: PropTypes.string
    })
  ).isRequired
};

export default KeyValueTable;
