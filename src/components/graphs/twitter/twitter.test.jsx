import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Twitter from './twitter';
import getTwitterIdFromURI from '../../../utils/get-twitter-id-from-uri/get-twitter-id-from-uri';

const render = ({ uris }) => {
  return { ...rtlRender(<Twitter uris={uris} />) };
};

const uris = [
  'https://twitter.com/i/web/status/896253444779982848',
  'https://twitter.com/i/web/status/898602096827654144',
  'https://twitter.com/i/web/status/898542814329528320',
  'https://twitter.com/i/web/status/899964266333319168',
  'https://twitter.com/i/web/status/901343868716687360',
  'https://twitter.com/i/web/status/901379698038632449',
  'https://twitter.com/i/web/status/901243143722487808'
];

test('renders first five Tweets', () => {
  const { getByText, queryByText } = render({ uris });

  uris.forEach((uri, index) => {
    const tweetId = getTwitterIdFromURI(uri); // this has its own tests, so we're fine
    return index < 5
      ? getByText(tweetId)
      : expect(queryByText(tweetId)).not.toBeInTheDocument();
  });
});

test('a button to view more Tweets is shown if there are > 5', () => {
  const { getByRole } = render({ uris });
  getByRole('button');
});

test('a button to view more Tweets is not shown if there are < 5', () => {
  const { queryByRole } = render({
    uris: ['https://twitter.com/i/web/status/901379698038632449']
  });
  expect(queryByRole('button')).not.toBeInTheDocument();
});

test('clicking on the button will load more Tweets', () => {
  const { getByRole, getByText } = render({ uris });
  const button = getByRole('button');

  userEvent.click(button);
  uris.forEach(uri => getByText(getTwitterIdFromURI(uri)));
});

test('clicking on the button will hide the button if there are no more Tweets', () => {
  const { getByRole, queryByRole } = render({ uris });
  const button = getByRole('button');

  userEvent.click(button);
  expect(queryByRole('button')).not.toBeInTheDocument();
});
