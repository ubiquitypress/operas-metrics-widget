import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import Tweet from './tweet';

const render = ({ tweetId = '1', placeholder } = {}) => {
  return {
    ...rtlRender(<Tweet tweetId={tweetId} placeholder={placeholder} />)
  };
};

test('renders a div with id of the tweet', () => {
  const { getByTestId } = render({ tweetId: '12345' });
  getByTestId('tweet-12345');
});

test('renders placeholder if provided', () => {
  const { getByText } = render({ placeholder: <p>Loading this tweet</p> });
  getByText('Loading this tweet');
});
