import { useIntl } from '@/i18n';
import styles from './graph-empty-message.module.scss';

export const GraphEmptyMessage = () => {
  const { t } = useIntl();

  return (
    <div className={styles['graph-empty-message']}>{t('graphs.empty')}</div>
  );
};
