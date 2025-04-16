import { useConfig } from '@/config';
import type { NavCount } from '@/types';
import { log } from '@/utils';
import type React from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { getNavCounts } from '../utils';

interface NavigationProviderProps {
  children: React.ReactNode;
}

interface ContextProps {
  loading: boolean;
  tabs: NavCount[];
  activeTab: string | null;
  setTab: (tab: string | null) => void;
}

interface StateProps {
  loading: ContextProps['loading'];
  tabs: ContextProps['tabs'];
  activeTab: ContextProps['activeTab'];
}

const NavigationContext = createContext<ContextProps>({
  loading: true,
  tabs: [],
  activeTab: null,
  setTab: () => null
});

export const NavigationProvider = (props: NavigationProviderProps) => {
  const { children } = props;
  const { config } = useConfig();
  const [state, setState] = useState<StateProps>({
    loading: true,
    tabs: [],
    activeTab: null
  });

  // Set/toggle the active tab
  const setTab = useCallback((tab: string | null) => {
    setState(s => ({ ...s, activeTab: s.activeTab === tab ? null : tab }));
  }, []);

  // Fetch the tabs
  useEffect(() => {
    const getTabs = async () => {
      const tabs = await getNavCounts(config);
      setState(s => ({ ...s, tabs, loading: false }));

      // Open the first tab by default
      if (tabs.length > 0 && config.options.open_first_tab_by_default) {
        setTab(tabs[0].id);
      }
    };
    getTabs().catch(log.error);
  }, [config, setTab]);

  return (
    <NavigationContext.Provider
      value={{
        loading: state.loading,
        tabs: state.tabs,
        activeTab: state.activeTab,
        setTab
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
