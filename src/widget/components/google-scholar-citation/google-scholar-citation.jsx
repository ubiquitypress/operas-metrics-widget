import React, { useMemo } from 'react';
import { useConfig } from '../../contexts/config';
import Trans from '../../contexts/i18n/trans';
import deepFind from '../../utils/deep-find';
import LinkWrapper from '../link-wrapper';
import styles from './google-scholar-citation.module.scss';

const GoogleScholarCitation = () => {
  const config = useConfig();

  const data = useMemo(
    () => ({
      enabled: deepFind(config, 'settings.show_google_scholar_citation_link'),
      title: deepFind(config, 'settings.work_title')
    }),
    [config]
  );

  if (!data.enabled || !data.title) return null;
  return (
    <div
      className={styles['google-scholar-citation']}
      data-testid='google-scholar-citation'
    >
      <Trans
        i18nKey='other.google_scholar_citation'
        components={[
          <LinkWrapper
            href={`https://scholar.google.com/scholar?q=${deepFind(
              config,
              'settings.work_title'
            )}`}
          />
        ]}
      />
    </div>
  );
};

export default GoogleScholarCitation;
