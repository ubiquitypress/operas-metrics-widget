import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import loadScript from '../../../utils/load-script';
import styles from './tweets.module.scss';
import Tweet from './tweet/tweet';
import { useTranslation } from '../../../contexts/i18n';

const Tweets = ({ data, onReady }) => {
  const LIMIT_INC = 5;
  const [ready, setReady] = useState(false);
  const [limit, setLimit] = useState(Math.min(LIMIT_INC, data.length));
  const { t } = useTranslation();

  const increaseLimit = () =>
    setLimit(Math.min(limit + LIMIT_INC, data.length));

  // Load the Twitter script, and the initial `limit` tweets
  useEffect(() => {
    loadScript('twitter.js', () => {
      setReady(true);
      if (onReady) onReady();
    });
  }, []);

  if (!ready) return null;
  return (
    <div className={styles.tweets}>
      <ul>
        {data.map((id, index) => {
          if (index >= limit) return null;
          return <Tweet key={id} id={id} />;
        })}
      </ul>

      {limit < data.length && (
        <button type='button' onClick={increaseLimit}>
          {t('other.view_more_amount', { amount: LIMIT_INC })}
        </button>
      )}
    </div>
  );
};

Tweets.propTypes = {
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  onReady: PropTypes.func.isRequired
};

export default Tweets;
