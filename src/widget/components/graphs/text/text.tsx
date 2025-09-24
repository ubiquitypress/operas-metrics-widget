import { useConfig } from '@/config';
import type { GraphData, TextGraph } from '@/types';
import { formatNumber, getAppVersion, sanitizeHTML } from '@/utils';
import type { HTMLAttributes } from 'react';
import styles from './text.module.scss';

interface TextProps {
  id?: string;
  config: TextGraph['config'];
  data: GraphData;
}

const DEFAULT_REGEX = /{(.*?)}/;

export const Text: React.FC<TextProps> = ({ id, config, data }) => {
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

  const textProps: HTMLAttributes<HTMLDivElement> = {
    id,
    className: styles.text
  };

  // If HTML support is enabled, render the text as HTML
  if (html_support === 'unsafe' || html_support === 'safe') {
    return (
      <div
        {...textProps}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: HTML is sanitized
        dangerouslySetInnerHTML={{
          __html: html_support === 'safe' ? sanitizeHTML(message) : message
        }}
      />
    );
  }

  // No HTML support, just render the text
  return <div {...textProps}>{message}</div>;
};
