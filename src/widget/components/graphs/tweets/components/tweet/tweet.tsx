import type { Graph } from '@/types';
import { cx } from '@/utils';
import { useEffect } from 'react';
import styles from './tweet.module.scss';

interface TweetProps {
  id: string;
  graphId: Graph['id'];
  hidden?: boolean;
}

export const Tweet = (props: TweetProps) => {
  const { id, graphId, hidden } = props;
  const elId = `${graphId}-tweet-${id}`;

  useEffect(() => {
    const el = document.querySelector(`#${elId}`);
    if (!el) {
      return;
    }

    // Load the tweet
    globalThis.twttr.widgets.createTweet(id, el);
  }, [elId, id]);

  return <div id={elId} className={cx(styles['twitter-tweet'], { hidden })} />;
};
