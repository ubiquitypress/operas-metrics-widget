import React, { useState } from 'react';
import { TwitterTweetEmbed } from 'react-twitter-embed';
import PropTypes from 'prop-types';
import styles from './twitter.module.scss';
import Loading from '../../loading/loading';
import getTwitterIdFromURI from '../../../utils/get-twitter-id-from-uri/get-twitter-id-from-uri';
import getString from '../../../localisation/get-string/get-string';
import Button from '../../button/button';

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
                <TwitterTweetEmbed
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
        <Button onClick={increaseLimit}>
          {getString('other.view_more_amount', { amount: LIMIT_INC })}
        </Button>
      )}
    </ul>
  );
};

Twitter.propTypes = {
  uris: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default Twitter;
