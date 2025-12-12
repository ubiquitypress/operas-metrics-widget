import { GraphEmptyMessage } from '@/components/common';
import { useIntl } from '@/i18n';
import type { Citations as ICitations } from '@/types';
import { cx, formatNumber } from '@/utils';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CitationIcon } from './citation-icon';
import styles from './citations.module.scss';
import { formatMeta } from './format-meta';

export interface CitationRecord {
  title: string;
  authors?: string;
  editors?: string;
  year?: number;
  source?: string;
  volume?: string | null;
  issue?: string | null;
  page?: string | null;
  doi?: string | null;
  url?: string | null;
  type?: string | null;
}

export interface CitationsProps {
  id: string;
  data: CitationRecord[];
  total: number;
  graph: ICitations;
}

export const Citations = (props: CitationsProps) => {
  const { id, data, total, graph } = props;
  const { t } = useIntl();
  const pageSize = graph.config?.page_size || 5;
  const [page, setPage] = useState(1);
  const listRef = useRef<HTMLDivElement | null>(null);

  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const showInlineTitle = graph.config?.show_inline_title ?? true;

  const viewAllLink = useMemo(
    () => graph.config?.view_all_url,
    [graph.config?.view_all_url]
  );

  const pageSlice = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return data.slice(start, end);
  }, [data, page, pageSize]);

  // Reset pagination when data set changes to avoid empty pages after filter changes.
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally rerun when data payload changes
  useEffect(() => {
    setPage(1);
  }, [data, total]);

  const pageItems = useMemo(() => {
    if (pageCount <= 7) {
      return Array.from({ length: pageCount }, (_, i) => i + 1);
    }

    const items: Array<number | 'ellipsis-left' | 'ellipsis-right'> = [1];
    const left = Math.max(2, page - 1);
    const right = Math.min(pageCount - 1, page + 1);

    if (left > 2) {
      items.push('ellipsis-left');
    }

    for (let p = left; p <= right; p += 1) {
      items.push(p);
    }

    if (right < pageCount - 1) {
      items.push('ellipsis-right');
    }

    items.push(pageCount);
    return items;
  }, [page, pageCount]);

  if (data.length === 0) {
    return <GraphEmptyMessage />;
  }

  const startIdx = (page - 1) * pageSize + 1;
  const endIdx = Math.min(page * pageSize, total);

  return (
    <div id={id} className={styles.citations}>
      <div className={styles.header}>
        {showInlineTitle && (
          <div className={styles.headerTitle}>
            {t('graphs.citations.title')}
          </div>
        )}
        <div className={styles.meta}>
          {t('graphs.citations.showing', {
            start: formatNumber(startIdx),
            end: formatNumber(endIdx),
            total: formatNumber(total)
          })}
        </div>
      </div>

      <div ref={listRef} className={styles.listArea}>
        <div className={styles.list}>
          {pageSlice.map((item, idx) => {
            const rank = startIdx + idx;
            const meta = formatMeta(item);
            const doiLink = item.doi ? `https://doi.org/${item.doi}` : item.url;
            const linkLabel = item.doi
              ? t('graphs.citations.doi_prefix')
              : t('graphs.citations.link_prefix');
            const typeLabel = item.type
              ? item.type.replace(/[-_]/g, ' ')
              : 'Citation';

            return (
              <div key={`${id}-${rank}`} className={styles.card}>
                <div className={styles.badge}>{rank}</div>
                <div className={styles.content}>
                  <div className={styles.type}>
                    <CitationIcon type={typeLabel} />
                    <span>{typeLabel}</span>
                  </div>
                  <div className={styles.citationTitle}>{item.title}</div>
                  {(item.authors || item.editors || item.year) && (
                    <div className={styles.byline}>
                      {item.authors || item.editors || ''}
                      {item.authors || item.editors ? ' ' : ''}
                      {item.year ? `(${item.year})` : ''}
                    </div>
                  )}
                  {meta && <div className={styles.meta}>{meta}</div>}
                  {doiLink && (
                    <div className={styles.links}>
                      <a href={doiLink} target='_blank' rel='noreferrer'>
                        {linkLabel} {item.doi || doiLink}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.footer}>
        <nav
          className={styles.pagination}
          aria-label={t('graphs.citations.pagination_label')}
        >
          <button
            type='button'
            onClick={() => {
              setPage(Math.max(1, page - 1));
              listRef.current?.scrollTo({ top: 0 });
            }}
            disabled={page === 1}
            aria-label={t('graphs.citations.prev_page')}
          >
            <ChevronLeft aria-hidden='true' />
          </button>
          {pageItems.map(item => {
            if (item === 'ellipsis-left' || item === 'ellipsis-right') {
              return (
                <span key={item} aria-hidden='true'>
                  …
                </span>
              );
            }
            const p = item;
            return (
              <button
                type='button'
                key={p}
                className={cx({ [styles.active]: p === page })}
                onClick={() => {
                  setPage(p);
                  listRef.current?.scrollTo({ top: 0 });
                }}
                aria-label={t('graphs.citations.go_to_page', {
                  page: formatNumber(p)
                })}
                aria-current={p === page ? 'page' : undefined}
              >
                {p}
              </button>
            );
          })}
          <button
            type='button'
            onClick={() => {
              setPage(Math.min(pageCount, page + 1));
              listRef.current?.scrollTo({ top: 0 });
            }}
            disabled={page === pageCount}
            aria-label={t('graphs.citations.next_page')}
          >
            <ChevronRight aria-hidden='true' />
          </button>
        </nav>
        {viewAllLink && (
          <a
            className={styles.viewAll}
            href={viewAllLink}
            target='_blank'
            rel='noreferrer'
          >
            <span>{t('graphs.citations.view_all')}</span>
            <ExternalLink aria-hidden='true' />
          </a>
        )}
      </div>
    </div>
  );
};
