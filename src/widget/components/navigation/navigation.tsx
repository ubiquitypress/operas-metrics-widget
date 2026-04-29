import { useConfig } from '@/config';
import { useIntl } from '@/i18n';
import type { NavCount } from '@/types';
import { cx, formatNumber } from '@/utils';
import type { KeyboardEvent } from 'react';
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

  // Implements the W3C tablist keyboard pattern: roving tabindex (only
  // one tab is in the document tab order) plus arrow / Home / End to
  // move focus among tabs. Focus moves are paired with auto-activation
  // to mirror the existing click-to-activate behaviour.
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.getAttribute('role') !== 'tab') {
      return;
    }
    const currentIndex = counts.findIndex(
      tab => `mw-tab-${tab.id}` === target.id
    );
    if (currentIndex === -1) {
      return;
    }

    let nextIndex: number | null = null;
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (currentIndex + 1) % counts.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = (currentIndex - 1 + counts.length) % counts.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = counts.length - 1;
        break;
    }
    if (nextIndex === null) {
      return;
    }

    e.preventDefault();
    const nextTab = counts[nextIndex];
    if (!nextTab) {
      return;
    }
    document.getElementById(`mw-tab-${nextTab.id}`)?.focus();
    if (nextTab.id !== activeTab) {
      setTab(nextTab.id);
    }
  };

  // Decide which tab is in the document tab order. If a tab is active,
  // it owns the slot. Otherwise (initial load with
  // open_first_tab_by_default disabled, or after a click-toggle off),
  // the first tab gets it so users can still tab into the list.
  const focusableTabId = activeTab ?? (counts.length > 0 ? counts[0].id : null);

  return (
    <div
      className={styles.navigation}
      role='tablist'
      aria-label={t('navigation.label')}
      onKeyDown={handleKeyDown}
    >
      {counts.map(tab => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            className={cx(styles['navigation-button'], {
              active: isActive
            })}
            type='button'
            role='tab'
            aria-selected={isActive}
            tabIndex={tab.id === focusableTabId ? 0 : -1}
            id={`mw-tab-${tab.id}`}
            aria-controls={`mw-tab-panel-${tab.id}`}
            onClick={() => setTab(tab.id)}
          >
            <div className={styles['navigation-count']}>
              {formatNumber(tab.total, config.settings.locale)}
            </div>
            <div className={styles['navigation-name']}>{tab.name}</div>
          </button>
        );
      })}
    </div>
  );
};
