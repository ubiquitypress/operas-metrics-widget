import { GraphEmptyMessage, Link, Table } from '@/components/common';
import { useIntl } from '@/i18n';
import { Logo } from './components';
import styles from './hypothesis-table.module.scss';

export interface HypothesisData {
  id: string;
  date: string;
  author: string;
  summary: {
    text: string;
    link: string;
  };
}

interface HypothesisTableProps {
  id?: string;
  data: HypothesisData[];
}

export const HypothesisTable = (props: HypothesisTableProps) => {
  const { t } = useIntl();
  const { id, data } = props;

  if (data.length === 0) {
    return <GraphEmptyMessage />;
  }
  return (
    <div id={id} className={styles['hypothesis-table']}>
      <Table.Root>
        <Table.Head>
          <Table.Row>
            <Table.Cell>{t('graphs.hypothesis.date')}</Table.Cell>
            <Table.Cell>{t('graphs.hypothesis.author')}</Table.Cell>
            <Table.Cell>{t('graphs.hypothesis.summary')}</Table.Cell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {data.map(item => (
            <Table.Row key={item.id}>
              <Table.Cell className={styles['hypothesis-date']}>
                {item.date}
              </Table.Cell>
              <Table.Cell className={styles['hypothesis-author']}>
                {item.author}
              </Table.Cell>
              <Table.Cell className={styles['hypothesis-summary']}>
                <Link href={item.summary.link}>
                  <div className={styles['hypothesis-summary-data']}>
                    <Logo />
                    {item.summary.text}
                  </div>
                </Link>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
};
