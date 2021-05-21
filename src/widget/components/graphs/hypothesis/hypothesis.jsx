import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from '../../../contexts/i18n';
import { Table, TableBody, TableCell, TableHead, TableRow } from '../../table';
import LinkWrapper from '../../link-wrapper';
import getAsset from '../../../utils/get-asset';
import trimString from '../../../utils/trim-string';
import formatTimestamp from '../../../utils/format-timestamp';
import styles from './hypothesis.module.scss';

const Hypothesis = ({ data, onReady }) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (onReady) onReady();
  }, []);

  if (data.length === 0) return <div>{t('other.no_data')}</div>;
  return (
    <div className={styles.hypothesis} data-testid='hypothesis'>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell head>{t('hypothesis_table.date')}</TableCell>
            <TableCell head>{t('hypothesis_table.author')}</TableCell>
            <TableCell head>{t('hypothesis_table.summary')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(item => (
            <TableRow key={item.id}>
              <TableCell>
                {item.created ? formatTimestamp(t, item.created, 'long') : '-'}
              </TableCell>
              <TableCell>
                {item.user ? item.user.replace('acct:', '') : '-'}
              </TableCell>
              <TableCell>
                <LinkWrapper href={item.links && item.links.html}>
                  <div className={styles['hypothesis-summary']}>
                    <img
                      className={styles['hypothesis-summary-icon']}
                      role='presentation'
                      aria-hidden='true'
                      src={getAsset('hypothesis.jpg')}
                      alt='Hypothesis'
                    />
                    {trimString(
                      t,
                      (item.document && item.document.title[0]) ||
                        (item.text && item.text) ||
                        '-',
                      100
                    )}
                  </div>
                </LinkWrapper>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

Hypothesis.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      created: PropTypes.string,
      user: PropTypes.string,
      links: PropTypes.shape({
        html: PropTypes.string
      }),
      document: PropTypes.shape({
        title: PropTypes.arrayOf(PropTypes.string)
      }),
      text: PropTypes.string
    })
  ).isRequired,
  onReady: PropTypes.func.isRequired
};

export default Hypothesis;
