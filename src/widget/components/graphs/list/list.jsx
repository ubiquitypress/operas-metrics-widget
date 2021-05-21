import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import LinkWrapper from '../../link-wrapper';
import styles from './list.module.scss';
import { useTranslation } from '../../../contexts/i18n';

const List = ({ data, onReady }) => {
  const { t } = useTranslation();
  useEffect(() => {
    if (onReady) onReady();
  }, []);

  if (data.length === 0) return <div>{t('other.no_data')}</div>;
  return (
    <ul className={styles.list} data-testid='list'>
      {data.map(item => (
        <li key={item.name} className={styles['list-item']}>
          <LinkWrapper href={item.link}>{item.name}</LinkWrapper>
        </li>
      ))}
    </ul>
  );
};

List.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      link: PropTypes.string
    })
  ).isRequired,
  onReady: PropTypes.func.isRequired
};

export default List;
