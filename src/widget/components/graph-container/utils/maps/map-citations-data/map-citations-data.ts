import type { CitationRecord } from '@/components';
import type { APIEvent, Config, GraphData, NameInput, Tab } from '@/types';

export const mapCitationsData = (
  data: GraphData,
  _tab: Tab,
  _config: Config
): { items: CitationRecord[]; total: number } => {
  // For now, use the merged array (all scopes). If needed, we can filter by graph.scopes later.
  const formatPerson = (person: NameInput) => {
    if (typeof person === 'string') {
      return person;
    }

    const family = person.last_name || person.family;
    const given = person.initial || person.given;
    if (family && given) {
      return `${family}, ${given}`;
    }
    if (family) {
      return family;
    }
    if (person.name) {
      return person.name;
    }
    return given || '';
  };

  const formatNames = (people?: NameInput[]) => {
    if (!people || people.length === 0) {
      return '';
    }
    return people.map(formatPerson).filter(Boolean).join('; ');
  };

  const items: CitationRecord[] = data.merged.map((entry: APIEvent) => {
    const citation = entry as Partial<APIEvent>;

    return {
      title: citation.title || '',
      authors: formatNames(citation.authors),
      editors: formatNames(citation.editors),
      year: citation.year,
      source: citation.source || undefined,
      volume: citation.volume || undefined,
      issue: citation.issue || undefined,
      page: citation.page || undefined,
      doi: citation.doi || undefined,
      url: citation.url || undefined,
      type: citation.type || undefined
    };
  });

  return {
    items,
    total: data.total || (items.length > 0 ? items.length : 0)
  };
};
