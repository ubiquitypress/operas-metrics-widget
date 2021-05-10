import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Loading from '../../../loading';
import { useTranslation } from '../../../../contexts/i18n';

const Tweet = ({ id }) => {
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    // eslint-disable-next-line no-undef
    twttr.widgets
      .createTweet(id, document.getElementById(`tweet-${id}`))
      .then(() => setLoading(false));
  }, []);

  return (
    <li id={`tweet-${id}`}>
      {loading && <Loading message={t('loading.tweet')} />}
    </li>
  );
};

Tweet.propTypes = {
  id: PropTypes.string.isRequired
};

export default Tweet;
