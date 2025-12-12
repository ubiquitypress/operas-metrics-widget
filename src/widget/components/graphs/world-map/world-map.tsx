import { GraphEmptyMessage } from '@/components/common';
import { useConfig } from '@/config';
import type { WorldMap as IWorldMap } from '@/types';
import { formatNumber, getWidgetStyle } from '@/utils';
import { useEffect, useMemo } from 'react';
import styles from './world-map.module.scss';
import { WorldMapTable } from './world-map-table';

export interface WorldMapProps {
  id: string;
  data: Record<string, number>;
  graph: IWorldMap;
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
    // @ts-expect-error jQuery is not defined in the global scope
    const $el = globalThis.$(`#${canvasId}`);
    if (!$el || typeof $el.vectorMap !== 'function') {
      return;
    }

    $el.vectorMap(options);

    // Helper to get current map instance
    const getMap = () =>
      $el.vectorMap('get', 'mapObject') || $el.data('mapObject');

    const resizeMap = () => {
      // Keep map sizing in sync with the host container
      const map = getMap();
      const host = document.getElementById(canvasId);
      if (!map || !host) {
        return;
      }

      // Prefer the nearest graph container height if present (has inline 250px)
      const graphContainer =
        host.closest('[class*="graph-container"]') || host.parentElement;
      const containerRect = graphContainer?.getBoundingClientRect();

      // Prefer measured heights, fall back to computed CSS or a sane default
      const { height: rectHeight } = host.getBoundingClientRect();
      const cssHeight = Number.parseFloat(
        globalThis.getComputedStyle?.(host)?.height || '0'
      );
      const containerHeight = containerRect?.height || 0;

      const candidateHeight =
        containerHeight ||
        rectHeight ||
        host.clientHeight ||
        host.offsetHeight ||
        cssHeight ||
        250;

      const targetHeight = Math.max(
        200,
        Math.min(800, Math.round(candidateHeight))
      );

      // Defensive guard: avoid NaN or zero-height updates
      if (!Number.isFinite(targetHeight) || targetHeight <= 0) {
        return;
      }

      host.style.height = `${targetHeight}px`;
      map.container?.css?.({ width: '100%', height: `${targetHeight}px` });
      map.updateSize?.();
    };

    // Initial pass to normalise sizing
    resizeMap();

    // Debounced window resize handling
    let resizeScheduled = false;
    const onResize = () => {
      if (resizeScheduled) {
        return;
      }
      resizeScheduled = true;
      requestAnimationFrame(() => {
        resizeMap();
        resizeScheduled = false;
      });
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      const map = getMap();
      if (map) {
        $el.vectorMap('remove');
      }
    };
  }, [canvasId, options]);

  if (Object.keys(data).length === 0) {
    return <GraphEmptyMessage />;
  }
  return (
    <>
      <div
        id={canvasId}
        className={styles['world-map']}
        data-testid='world-map'
        aria-hidden
      />

      <WorldMapTable {...props} />
    </>
  );
};
