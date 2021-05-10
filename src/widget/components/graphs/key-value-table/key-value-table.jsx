import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import LinkWrapper from '../../link-wrapper';
import { useTranslation } from '../../../contexts/i18n';
import styles from './key-value-table.module.scss';

const KeyValueTable = ({ data, onReady }) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (onReady) onReady();
  }, []);

  if (data.length === 0) return <p>{t('other.no_data')}</p>;
  return (
    <ul className={styles['key-value-table']}>
      {data.map(item => (
        <li key={item.key} className={styles['key-value-table-item']}>
          <div className={styles['key-value-table-item-key']}>
            <LinkWrapper href={item.link}>{item.key}</LinkWrapper>
          </div>
          {item.value && (
            <div className={styles['key-value-table-item-value']}>
              {item.value}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

KeyValueTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      link: PropTypes.string,
      value: PropTypes.string
    })
  ).isRequired,
  onReady: PropTypes.func.isRequired
};

export default KeyValueTable;
