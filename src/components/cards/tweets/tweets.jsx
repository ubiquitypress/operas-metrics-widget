import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import getMetricsConfig from '../../../utils/get-metrics-config/get-metrics-config';
import fetchAllUrls from '../../../utils/fetch-all-urls/fetch-all-urls';
import flattenArray from '../../../utils/flatten-array/flatten-array';
import CardWrapper from '../../card-wrapper/card-wrapper';
import getString from '../../../localisation/get-string/get-string';
import Twitter from '../../graphs/twitter/twitter';

const Tweets = ({ uris, onReady, hidden }) => {
  const [tweetURIs, setTweetURIs] = useState(null);

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

      // Make an array of only URIs
      const allURIs = data.map(uri => uri.event_uri);

      // Update the state for these URIs
      setTweetURIs(allURIs);

      // Tell the parent that we're ready
      onReady();
    });
  };

  // Called when component mounts, or the array of UIRs changes
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    // No URIs provided, or the tab was closed
    if (!uris || uris.length === 0) return setTweetURIs(null);

    // Go through each URI and fetch its data
    fetchURIs();
  }, [uris]);

  if (hidden) return null;
  if (tweetURIs)
    return (
      <CardWrapper label={getString('tabs.tweets')} data-testid='tweets'>
        <Twitter uris={tweetURIs} />
      </CardWrapper>
    );
  return null;
};

Tweets.propTypes = {
  uris: PropTypes.arrayOf(PropTypes.string).isRequired,
  onReady: PropTypes.func,
  hidden: PropTypes.bool
};
Tweets.defaultProps = {
  hidden: false,
  onReady: null
};

export default Tweets;
