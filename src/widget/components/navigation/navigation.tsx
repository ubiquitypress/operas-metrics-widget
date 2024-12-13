import React from 'react';
import { useConfig } from '@/config';
import { useIntl } from '@/i18n';
import type { NavCount } from '@/types';
import { cx, formatNumber } from '@/utils';
import styles from './navigation.module.scss';
import { useNavigation } from './provider';

interface NavigationProps {
  counts: NavCount[];
}

export const Navigation = (props: NavigationProps) => {
  const { counts } = props;
  const { activeTab, setTab } = useNavigation();
  const { config } = useConfig();
  const { t } = useIntl();

  return (
    <div
      className={styles.navigation}
      role='tablist'
      aria-label={t('navigation.label')}
    >
      {counts.map(tab => (
        <button
          key={tab.id}
          className={cx(styles['navigation-button'], {
            active: tab.id === activeTab
          })}
          type='button'
          role='tab'
          aria-selected={false}
          id={`mw-tab-${tab.id}`}
          aria-controls={`mw-tab-panel-${tab.id}`}
          onClick={() => setTab(tab.id)}
        >
          <div className={styles['navigation-count']}>
            {formatNumber(tab.total, config.settings.locale)}
          </div>
          <div className={styles['navigation-name']}>{tab.name}</div>
        </button>
      ))}
    </div>
  );
};
