import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import getMetricsConfig from '../../../utils/get-metrics-config/get-metrics-config';
import fetchAllUrls from '../../../utils/fetch-all-urls/fetch-all-urls';
import flattenArray from '../../../utils/flatten-array/flatten-array';
import CardWrapper from '../../card-wrapper/card-wrapper';
import getString from '../../../localisation/get-string/get-string';
import Table from '../../ui/table/table';
import TableHead from '../../ui/table-head/table-head';
import TableRow from '../../ui/table-row/table-row';
import TableCell from '../../ui/table-cell/table-cell';
import TableBody from '../../ui/table-body/table-body';
import formatTimestamp from '../../../utils/format-timestamp/format-timestamp';
import trimString from '../../../utils/trim-string/trim-string';
import styles from './hypothesis.module.scss';
import getVersion from '../../../utils/get-version/get-version';

const Hypothesis = ({ uris, onReady, hidden, width, hideLabel }) => {
  const [tableData, setTableData] = useState(null);

  const fetchURIs = async () => {
    const metricsConfig = getMetricsConfig();

    // Get the full URLs
    const urls = uris.map(
      uri =>
        `${metricsConfig.settings.base_url}?filter=work_uri:${metricsConfig.settings.work_uri},measure_uri:${uri}`
    );

    // Fetch all URLs
    fetchAllUrls(urls, res => {
      const data = flattenArray(res).filter(item => item.event_uri);

      // Get all Hypothesis IDs
      const ids = data.map(item => {
        return item.event_uri.indexOf('hypothes.is') !== -1
          ? item.event_uri.replace(/.*hypothes.is\/a\//g, '')
          : null;
      });

      // Convert the IDs to URLs
      const hypothesisUrls = ids.map(
        id => `https://api.hypothes.is/api/annotations/${id}`
      );

      // Fetch the information
      Promise.all(hypothesisUrls.map(url => fetch(url))).then(responses =>
        Promise.all(responses.map(res2 => res2.json().then(json => json))).then(
          json => {
            // Update the state, so that we can view the data
            setTableData(json);

            // Tell the parent that we're ready
            onReady();
          }
        )
      );
    });
  };

  // Called when component mounts, or the array of UIRs changes
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    // No URIs provided, or the tab was closed
    if (!uris || uris.length === 0) return setTableData(null);

    // Go through each URI and fetch its data
    fetchURIs();

    // On component unmount
    return () => setTableData(null);
  }, [uris]);

  if (hidden) return null;
  if (tableData)
    return (
      <CardWrapper
        label={getString('labels.hypothesis')}
        width={width}
        hideLabel={hideLabel}
        data-testid='hypothesis'
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell isHead>{getString('hypothesis_table.date')}</TableCell>
              <TableCell isHead>
                {getString('hypothesis_table.author')}
              </TableCell>
              <TableCell isHead>
                {getString('hypothesis_table.summary')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map(item => {
              if (!item || item.status) return null;

              return (
                <TableRow key={item.created}>
                  <TableCell>{formatTimestamp(item.created, 'long')}</TableCell>
                  <TableCell>{item.user.replace('acct:', '')}</TableCell>
                  <TableCell>
                    <a
                      href={item.links.html}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <img
                        className={styles.icon}
                        src={`https://storage.googleapis.com/operas/metrics-widget-${getVersion()}/hypothesis.jpg`}
                        alt='Hypothesis'
                      />
                    </a>
                    {trimString(item.document.title || item.text, 100)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardWrapper>
    );
  return null;
};

Hypothesis.propTypes = {
  uris: PropTypes.arrayOf(PropTypes.string).isRequired,
  onReady: PropTypes.func,
  hidden: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  hideLabel: PropTypes.bool
};
Hypothesis.defaultProps = {
  hidden: false,
  onReady: null,
  width: null,
  hideLabel: null
};

export default Hypothesis;
