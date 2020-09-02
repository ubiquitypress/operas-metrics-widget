import { JSDOM } from 'jsdom';
const dom = new JSDOM();
global.document = dom.window.document;
global.window = dom.window;

// This allows us to mock the `metrics_config` object
// which we are expecting to be present in all components
global.metrics_config = {
  settings: {
    base_url: 'https://metrics-api.operas-eu.org/events',
    work_uri: 'info:doi:10.5334/bay',
    language: 'en',
    localise_country_codes: false
  },
  tabs: {
    downloads: {
      nav_counts: ['*'],
      graphs: {
        country_table: [
          'https://metrics.operas-eu.org/up-ga/downloads/v1',
          'https://metrics.operas-eu.org/oapen/downloads/v1'
        ],
        time_graph: ['https://metrics.operas-eu.org/up-logs/downloads/v1']
      }
    },
    tweets: {
      nav_counts: ['*'],
      graphs: {}
    },
    citations: {
      nav_counts: ['*'],
      graphs: {}
    }
  }
};
