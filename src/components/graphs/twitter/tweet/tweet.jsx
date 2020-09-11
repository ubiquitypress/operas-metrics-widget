import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import loadExternalScript from '../../../../utils/load-external-script/load-external-script';

const Tweet = ({ tweetId, placeholder }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExternalScript('twitter', () => {
      // eslint-disable-next-line no-undef
      twttr.widgets
        .createTweet(tweetId, document.getElementById(`tweet-${tweetId}`))
        .then(() => setLoading(false));
    });
  }, []);

  return (
    <div id={`tweet-${tweetId}`} data-testid={`tweet-${tweetId}`}>
      {loading && placeholder ? placeholder : null}
    </div>
  );
};

Tweet.propTypes = {
  tweetId: PropTypes.string.isRequired,
  placeholder: PropTypes.node
};
Tweet.defaultProps = {
  placeholder: null
};

export default Tweet;
