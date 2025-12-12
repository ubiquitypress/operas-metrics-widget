import { useConfig } from '@/config';
import { useIntl } from '@/i18n';
import { formatNumber } from '@/utils';
import type { LineGraphProps } from '../line-graph';
import styles from './line-graph-table.module.scss';

export const LineGraphTable: React.FC<LineGraphProps> = ({
  id,
  graph,
  datasets,
  labels
}) => {
  const { config } = useConfig();
  const { t } = useIntl();
  const labelOccurrences = new Map<string, number>();

  return (
    <table key={id} className={styles['line-graph-table']}>
      <caption>{graph.title}</caption>
      <thead>
        <tr>
          <th scope='col'>{t('graphs.line_graph.date_label')}</th>
          {datasets.map((dataset, datasetIndex) => (
            <th key={`${id}-head-${dataset.label}-${datasetIndex}`} scope='col'>
              {dataset.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {labels.map((label, index) => {
          const occurrence = labelOccurrences.get(label) ?? 0;
          labelOccurrences.set(label, occurrence + 1);
          const safeLabel = label ?? `row-${index}`;
          const rowKey = `${id}-row-${safeLabel}-${occurrence}`;

          return (
            <tr key={rowKey}>
              <th scope='row'>{label}</th>
              {datasets.map((dataset, datasetIndex) => (
                <td
                  key={`${dataset.label}-${safeLabel}-${occurrence}-${datasetIndex}`}
                >
                  {formatNumber(dataset.data[index], config.settings.locale)}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        <tr>
          <th scope='row'>{t('graphs.line_graph.total_label')}</th>
          {datasets.map((dataset, datasetIndex) => (
            <td key={`${id}-total-${dataset.label}-${datasetIndex}`}>
              {formatNumber(
                dataset.data.reduce((a, b) => a + b, 0),
                config.settings.locale
              )}
            </td>
          ))}
        </tr>
      </tfoot>
    </table>
  );
};
