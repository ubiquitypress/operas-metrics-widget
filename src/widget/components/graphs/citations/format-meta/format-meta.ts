export interface CitationMetaFields {
  source?: string;
  volume?: string | null;
  issue?: string | null;
  page?: string | null;
}

/**
 * Formats citation metadata into a single display string.
 *
 * - Combines source, volume/issue, and page when present.
 * - If both volume and issue exist, renders as `volume(issue)`.
 * - Skips missing parts without extra separators.
 *
 * @param item - Citation metadata fields to render.
 * @returns Comma-delimited metadata string; empty when no parts exist.
 */
export const formatMeta = (item: CitationMetaFields): string => {
  const parts: string[] = [];
  if (item.source) {
    parts.push(item.source);
  }
  const volIssue: string[] = [];
  if (item.volume) {
    volIssue.push(item.volume);
  }
  if (item.issue) {
    volIssue.push(item.issue);
  }
  // When both volume and issue exist, render as "volume(issue)"; otherwise show the single value.
  if (volIssue.length === 2) {
    parts.push(`${volIssue[0]}(${volIssue[1]})`);
  } else if (volIssue.length === 1) {
    parts.push(volIssue[0]);
  }
  if (item.page) {
    parts.push(item.page);
  }
  return parts.join(', ');
};
