import { Book, Database, FileText, Info } from 'lucide-react';
import styles from '../citations.module.scss';

export interface CitationIconProps {
  type: string;
}

/**
 * Renders an icon representing the citation type, normalizing common variants.
 *
 * @param props.type - Citation type label (e.g., "journal article", "book", "dataset").
 * @returns Inline icon wrapped for consistent styling.
 */
export const CitationIcon = ({ type }: CitationIconProps) => {
  const normalized = type.toLowerCase();
  const common = normalized.replace(/[-_]/g, '');

  const icon = (() => {
    if (common.includes('journal') || common.includes('article')) {
      return <FileText aria-hidden='true' />;
    }
    if (common.includes('book')) {
      return <Book aria-hidden='true' />;
    }
    if (common.includes('dataset') || common.includes('data')) {
      return <Database aria-hidden='true' />;
    }
    return <Info aria-hidden='true' />;
  })();

  return <span className={styles.icon}>{icon}</span>;
};
