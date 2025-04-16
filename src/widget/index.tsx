import { NavigationProvider } from './components';
import { ConfigProvider } from './config';
import { EventsProvider } from './events';
import { IntlProvider } from './i18n';
import type { UserConfig } from './types';
import { Widget } from './widget';

interface MainProps {
  config: UserConfig;
}

// This component is the entry point for the React widget,
// simply initialising all the providers and passing the config
export const Main = (props: MainProps) => {
  const { config } = props;

  return (
    <ConfigProvider config={config}>
      <EventsProvider>
        <IntlProvider>
          <NavigationProvider>
            <Widget />
          </NavigationProvider>
        </IntlProvider>
      </EventsProvider>
    </ConfigProvider>
  );
};
