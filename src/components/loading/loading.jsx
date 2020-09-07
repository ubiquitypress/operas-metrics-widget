import React from 'react';
import PropTypes from 'prop-types';
import getString from '../../localisation/get-string/get-string';
import styles from './loading.module.scss';

const Loading = ({ message }) => {
  return (
    <div className={styles.loading} data-testid='loading'>
      <div className={styles.bars}>
        <div className={styles.loadingBar} />
        <div className={styles.loadingBar} />
        <div className={styles.loadingBar} />
      </div>
      <div className={styles.message}>
        <p role='alert' aria-busy='true'>
          {message || getString('loading.default')}
        </p>
      </div>
    </div>
  );
};

Loading.propTypes = {
  message: PropTypes.string
};
Loading.defaultProps = {
  message: null
};

export default Loading;
