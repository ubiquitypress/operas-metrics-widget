import { DEFAULT_ELEMENT_ID } from '../../consts';

// this object is merged with any configuration provided by the user,
// with the user's configuration being given overwriting priority
const defaultConfig = {
  settings: {
    element_id: DEFAULT_ELEMENT_ID,
    language: 'en',
    start_graphs_from_zero: false,
    hide_initial_loading_screen: false,
    base_y_axis_always_zero: true,
    show_citation_link: false
  },
  theme: {
    graph_primary: '#506cd3'
  }
};

export default defaultConfig;
