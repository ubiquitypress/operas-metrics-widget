import type { GraphData } from '@/types';
import { getCountryCodeFromUri } from '@/utils';

export const mapWorldMapData = (data: GraphData) => {
  // Create an object to store the data
  const countries: Record<string, number> = {};

  // Loop through each event
  for (const event of data.merged) {
    // Get the country from the event
    const { country_uri } = event;

    // If the country exists, add the value to the object
    if (country_uri) {
      const code = getCountryCodeFromUri(country_uri);
      if (code) {
        if (countries[code]) {
          countries[code] += event.value;
        } else {
          countries[code] = event.value;
        }
      }
    }
  }

  // Return the data
  return countries;
};
