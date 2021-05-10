import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from '../../../contexts/i18n';
import { Table, TableBody, TableCell, TableHead, TableRow } from '../../table';
import LinkWrapper from '../../link-wrapper';
import getAsset from '../../../utils/get-asset';
import trimString from '../../../utils/trim-string';
import styles from './hypothesis.module.scss';
import formatTimestamp from '../../../utils/format-timestamp';

const Hypothesis = ({ data, onReady }) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (onReady) onReady();
  }, []);

  return (
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
            <TableCell>{formatTimestamp(t, item.created, 'long')}</TableCell>
            <TableCell>{item.user.replace('acct:', '')}</TableCell>
            <TableCell>
              <LinkWrapper href={item.links.html}>
                <div className={styles['hypothesis-summary']}>
                  <img
                    className={styles['hypothesis-summary-icon']}
                    role='presentation'
                    aria-hidden='true'
                    src={getAsset('hypothesis.jpg')}
                    alt='Hypothesis'
                  />
                  {trimString(t, item.document.title[0] || item.text, 100)}
                </div>
              </LinkWrapper>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
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
