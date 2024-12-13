import type { ListData } from '@/components';
import type { GraphData, List } from '@/types';

export const mapListData = (data: GraphData, graph: List): ListData[] => {
  const { name_regex, name_replacements } = graph.config || {};
  const map: ListData[] = [];

  for (const event of data.merged) {
    if (!event.event_uri) {
      continue;
    }

    // Get the name based on the regex
    let name = event.event_uri;
    if (name_regex) {
      const regex = new RegExp(name_regex);
      const match = RegExp(regex).exec(event.event_uri);
      if (match) {
        // Set the name
        name = match.at(-1) || name;

        // Decode the name
        name = decodeURIComponent(name);

        // Replace the name
        if (name_replacements) {
          for (const [key, value] of Object.entries(name_replacements)) {
            name = name.replaceAll(key, value);
          }
        }
      }
    }

    // Add the event to the map
    map.push({
      id: event.event_id,
      name,
      link: event.event_uri
    });
  }

  return map;
};
