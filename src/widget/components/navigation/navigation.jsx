import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from '../../contexts/i18n';
import styles from './navigation.module.scss';

const Navigation = ({ tabs, active, setTab }) => {
  const { t } = useTranslation();

  return (
    <div
      className={styles.navigation}
      role='tablist'
      aria-label={t('general.title')}
    >
      {Object.entries(tabs).map(([name, val]) => (
        <button
          key={name}
          className={`${styles['navigation-button']}${
            active === name ? ' active' : ''
          }`}
          role='tab'
          type='button'
          aria-selected={active === name}
          aria-controls={`mw-tabpanel-${name}`}
          id={`mw-tab-${name}`}
          onClick={() => setTab(name)}
        >
          <div className={styles['navigation-count']}>{val}</div>
          <div className={styles['navigation-name']}>{t(`tabs.${name}`)}</div>
        </button>
      ))}
    </div>
  );
};

Navigation.propTypes = {
  tabs: PropTypes.objectOf(PropTypes.number).isRequired,
  active: PropTypes.string,
  setTab: PropTypes.func.isRequired
};
Navigation.defaultProps = {
  active: null
};

export default Navigation;
