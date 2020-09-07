import React from 'react';
import getString from '../../localisation/get-string/get-string';
import styles from './loading.module.scss';

const Loading = () => {
  return (
    <div className={styles.loading} data-testid='loading'>
      <div className={styles.bars}>
        <div className={styles.loadingBar} />
        <div className={styles.loadingBar} />
        <div className={styles.loadingBar} />
      </div>
      <div className={styles.message}>
        <p role='alert' aria-busy='true'>
          {getString('loading.loading_graphs')}
        </p>
      </div>
    </div>
  );
};

export default Loading;
