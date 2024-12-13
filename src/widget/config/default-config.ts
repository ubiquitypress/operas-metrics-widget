import type { Config } from '@/types';
import { DEFAULT_ELEMENT_ID } from './consts';

export const defaultConfig: Config = {
  settings: {
    base_url: 'https://metrics-api.operas-eu.org/events',
    element_id: DEFAULT_ELEMENT_ID,
    locale: 'en-US',
    cdn_scripts_url:
      'https://storage.googleapis.com/operas/metrics-widget/v{major}/{version}/scripts',
    cdn_images_url:
      'https://storage.googleapis.com/operas/metrics-widget/v{major}/{version}/images'
  },
  options: {
    default_graph_width: 100,
    hide_initial_loading_screen: false,
    load_graph_data_immediately: false,
    open_first_tab_by_default: false,
    locale_fallback_type: 'mixed'
  },
  tabs: [],
  locales: {}
};
