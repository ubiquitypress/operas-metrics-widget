import type { Tab } from './tab';

// We have two Config types -- one is `Config`, which should be used throughout the widget codebase
// so that you don't need to worry about any properties being undefined.
//
// The other is `UserConfig`, which is for the user to provide their configuration to the widget.
// Since a lot of fields are optional, it is a Partial of the Config object.
//
// When the ConfigProvider receives the UserConfig, it is merged with a DefaultConfig to ensure that
// all fields are defined.

export interface Config {
  settings: {
    base_url: string;
    element_id: string;
    locale: string;
    cdn_scripts_url: string;
    cdn_images_url: string;
  };
  options: {
    default_graph_width: number;
    hide_initial_loading_screen: boolean;
    load_graph_data_immediately: boolean;
    open_first_tab_by_default: boolean;
    locale_fallback_type: 'mixed' | 'supported';
  };
  tabs: Tab[];
  locales: Record<string, object>;
  components?: {
    initial_loading_screen?: React.ReactElement;
    tab_panel_loading_screen?: React.ReactElement;
  };
}

export interface UserConfig extends Partial<Config> {}
