import { useConfig } from '@/config';
import type { GraphData, TextGraph } from '@/types';
import { formatNumber, getAppVersion, sanitizeHTML } from '@/utils';
import styles from './text.module.scss';

interface TextProps {
  id?: string;
  config: TextGraph['config'];
  data: GraphData;
}

const DEFAULT_REGEX = /{(.*?)}/;

export const Text = (props: TextProps) => {
  const { id, config, data } = props;
  const widget = useConfig();

  // Pull the options from the config
  const {
    variable_regex = DEFAULT_REGEX,
    html_support = 'safe',
    content
  } = config;

  // Make a dictionary of all text replacements
  const replacements = {
    app_version: getAppVersion().version,

    // get the `total` from each `data.data` object
    ...Object.fromEntries(
      Object.entries(data.data).map(([key, value]) => [key, value?.total || 0])
    )
  };

  // Replace the placeholders with the actual values
  const message = content.replaceAll(
    new RegExp(variable_regex, 'g'),
    (match, variable) => {
      if (variable in replacements) {
        const value = replacements[variable as keyof typeof replacements];
        if (typeof value === 'number') {
          return formatNumber(value, widget.config.settings.locale);
        }
        return value;
      }
      return match;
    }
  );

  // Make a component to render the text
  const Component = (props: any) => {
    return <div id={id} className={styles.text} {...props} />;
  };

  // If HTML support is enabled, render the text as HTML
  if (html_support === 'unsafe' || html_support === 'safe') {
    return (
      <Component
        // biome-ignore lint/security/noDangerouslySetInnerHtml: HTML is sanitized
        dangerouslySetInnerHTML={{
          __html: html_support === 'safe' ? sanitizeHTML(message) : message
        }}
      />
    );
  }

  // No HTML support, just render the text
  return <Component>{message}</Component>;
};
