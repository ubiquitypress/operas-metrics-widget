import { useConfig } from '@/config';
import { useIntl } from '@/i18n';
import { getAssetPath } from '@/utils';
import styles from './logo.module.scss';

export const Logo = () => {
  const { config } = useConfig();
  const { t } = useIntl();

  return (
    <img
      alt={t('graphs.hypothesis.title')}
      className={styles['hypothesis-logo']}
      src={getAssetPath('image', 'hypothesis-logo.svg', config)}
    />
  );
};
