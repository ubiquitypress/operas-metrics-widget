import { GraphEmptyMessage } from '@/components/common';
import { useConfig } from '@/config';
import { useIntl } from '@/i18n';
import { formatNumber } from '@/utils';
import styles from './country-table.module.scss';

interface CountryTableProps {
  id?: string;
  data: {
    key: string;
    value: number;
  }[];
}

export const CountryTable = (props: CountryTableProps) => {
  const { id, data } = props;
  const { config } = useConfig();
  const { t } = useIntl();

  if (data.length === 0) {
    return <GraphEmptyMessage />;
  }
  return (
    <ul id={id} className={styles['country-table']}>
      {data.map(item => (
        <li key={item.key} className={styles['country-table-item']}>
          <div className={styles['country-table-item-key']}>
            {item.key || t('graphs.country_table.unknown')}
          </div>
          <div className={styles['country-table-item-value']}>
            {formatNumber(item.value, config.settings.locale)}
          </div>
        </li>
      ))}
    </ul>
  );
};
