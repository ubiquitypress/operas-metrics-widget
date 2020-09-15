import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './twitter.module.scss';
import Loading from '../../loading/loading';
import getTwitterIdFromURI from '../../../utils/get-twitter-id-from-uri/get-twitter-id-from-uri';
import getString from '../../../localisation/get-string/get-string';
import Button from '../../ui/button/button';
import Tweet from './tweet/tweet';

const Twitter = ({ uris }) => {
  const LIMIT_INC = 5;
  const [limit, setLimit] = useState(LIMIT_INC);

  const increaseLimit = () => {
    setLimit(limit + LIMIT_INC);
  };

  return (
    <ul className={styles.twitter}>
      {uris.map((uri, index) => {
        if (index < limit) {
          const twitterId = getTwitterIdFromURI(uri);
          return (
            <li key={uri}>
              {process.env.NODE_ENV === 'test' ? (
                <p>{twitterId}</p>
              ) : (
                <Tweet
                  tweetId={twitterId}
                  placeholder={<Loading message={getString('loading.tweet')} />}
                />
              )}
            </li>
          );
        }
        return null;
      })}

      {uris.length > limit && (
        <div className={styles.viewMore}>
          <Button className={styles.button} onClick={increaseLimit}>
            {getString('other.view_more_amount', { amount: LIMIT_INC })}
          </Button>
        </div>
      )}
    </ul>
  );
};

Twitter.propTypes = {
  uris: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default Twitter;
