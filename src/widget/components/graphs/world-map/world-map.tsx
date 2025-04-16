import { GraphEmptyMessage } from '@/components/common';
import { useConfig } from '@/config';
import { formatNumber, getWidgetStyle } from '@/utils';
import { useEffect, useMemo } from 'react';
import styles from './world-map.module.scss';

interface WorldMapProps {
  id: string;
  data: Record<string, number>;
}

export const WorldMap = (props: WorldMapProps) => {
  const { id, data } = props;
  const { config } = useConfig();

  // All the IDs we need to reference the graph
  const canvasId = `${id}-world-map`;

  // Get the colors
  const colorVars = useMemo(
    () => ({
      primary: ['color-world-map', 'color-primary'],
      secondary: ['color-world-map-dark', 'color-secondary']
    }),
    []
  );

  const colors = useMemo(
    () => ({
      base: getWidgetStyle(colorVars.primary, config) || '#dbe1f6',
      darker: getWidgetStyle(colorVars.secondary, config) || '#899de2'
    }),
    [colorVars, config]
  );

  const options = useMemo(
    () => ({
      // The general config
      map: 'world_merc',
      backgroundColor: 'transparent',
      zoomOnScroll: false,
      regionStyle: {
        initial: {
          fill: colors.base,
          stroke: 'none',
          'stroke-width': 0,
          'stroke-opacity': 0
        },
        hover: {
          'fill-opacity': 0.8
        },
        selected: {},
        selectedHover: {}
      },

      // The data to display
      series: {
        regions: [
          {
            values: data,
            scale: [colors.base, colors.darker],
            normalizeFunction: 'polynomial'
          }
        ]
      },

      // The tooltip
      onRegionTipShow: (
        _e: JQuery.Event,
        el: JQuery<HTMLElement>,
        code: string
      ) => {
        // Get the country name
        const { locale } = config.settings;
        const regionNames = new Intl.DisplayNames([locale], { type: 'region' });
        const name = regionNames.of(code);

        // Format the value
        const value = formatNumber(data[code] || 0, locale);

        // Set the tooltip
        el.html(`
        <ul class="${styles['world-map-tooltip']}">
          <li>${name}</li>
          <li>${value}</li>
        </ul>`);
      }
    }),
    [colors.base, colors.darker, config.settings, data]
  );

  // Render the graph when the component is mounted
  useEffect(() => {
    // @ts-ignore jQuery is not defined in the global scope
    globalThis.$(`#${canvasId}`).vectorMap(options);
  }, [canvasId, options]);

  if (Object.keys(data).length === 0) {
    return <GraphEmptyMessage />;
  }
  return (
    <div
      id={canvasId}
      className={styles['world-map']}
      data-testid='world-map'
    />
  );
};
