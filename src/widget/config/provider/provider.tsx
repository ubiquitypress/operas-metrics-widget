import type { Config, UserConfig } from '@/types';
import { deepMerge } from '@/utils';
import type React from 'react';
import { createContext, useContext, useState } from 'react';
import { defaultConfig } from '../default-config';

interface ConfigProviderProps {
  config: UserConfig;
  children: React.ReactNode;
}

interface ContextProps {
  config: Config;
  setConfig: (config: Config) => void;
}

const ConfigContext = createContext<ContextProps>({
  config: defaultConfig,
  setConfig: () => null
});

/**
 * The ConfigProvider receives a `UserConfig` object, which is essentially
 * just a partial `Config` object. It then merges the default config with
 * the user config and passes it down to the rest of the app via the context.
 */
export const ConfigProvider = (props: ConfigProviderProps) => {
  const { config, children } = props;
  const [state, setState] = useState<Config>(
    deepMerge(defaultConfig, config) as Config
  );

  const setConfig = (config: Config) => {
    setState(s => deepMerge(s, config) as Config);
  };

  return (
    <ConfigContext.Provider value={{ config: state, setConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);
