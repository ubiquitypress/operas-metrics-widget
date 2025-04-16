import { GraphEmptyMessage } from '@/components/common';
import { useIntl } from '@/i18n';
import type { Graph } from '@/types';
import { useState } from 'react';
import { Tweet } from './components';
import styles from './tweets.module.scss';

export interface TweetsProps {
  id: string;
  data: string[];
  graphId: Graph['id'];
}

const LIMIT = 4;

export const Tweets = (props: TweetsProps) => {
  const { id, data, graphId } = props;
  const [limit, setLimit] = useState(LIMIT);
  const { t } = useIntl();

  if (data.length === 0) {
    return <GraphEmptyMessage />;
  }
  return (
    <div id={id} className={styles.tweets}>
      {data.map((id, i) => {
        let hidden = false;

        // In order to make the tweets appear to load immediately, we'll
        // also render LIMIT more tweets than we need to, but keep them hidden
        if (i >= limit) {
          hidden = true;

          // Don't render any more than limit+4 tweets
          if (i >= limit + LIMIT) {
            return null;
          }
        }

        return <Tweet key={id} id={id} graphId={graphId} hidden={hidden} />;
      })}

      {data.length > limit && (
        <button
          type='button'
          className={styles['more-tweets-button']}
          onClick={() => setLimit(limit + LIMIT)}
        >
          {t('graphs.tweets.load_more')}
        </button>
      )}
    </div>
  );
};
