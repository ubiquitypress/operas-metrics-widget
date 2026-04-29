import { GraphEmptyMessage } from '@/components/common';
import { graphDefaults, useConfig } from '@/config';
import type { WorldMap as IWorldMap } from '@/types';
import { formatNumber, getWidgetStyle } from '@/utils';
import { geoMercator, geoPath } from 'd3-geo';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import { mix } from 'polished';
import { useMemo, useState } from 'react';
import { feature } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
import worldData from 'world-atlas/countries-110m.json';
import { isoNumericToAlpha2 } from './iso-numeric-to-alpha2';
import styles from './world-map.module.scss';
import { WorldMapTable } from './world-map-table';

export interface WorldMapProps {
  id: string;
  data: Record<string, number>;
  graph: IWorldMap;
}

const VIEW_WIDTH = 800;
const VIEW_HEIGHT = 500;

// Antarctica dominates a Mercator projection's vertical extent — exclude it
// so fitSize frames the inhabited world the same way jvectormap world_merc did.
const ANTARCTICA_NUMERIC_ID = '010';

// Convert topojson to GeoJSON features once at module load. The data is
// static and the conversion is mildly expensive.
const COUNTRIES: Feature<Geometry>[] = (() => {
  const topology = worldData as unknown as Topology;
  const collection = topology.objects.countries as GeometryCollection;
  const fc = feature(topology, collection) as unknown as FeatureCollection;
  return fc.features.filter(f => {
    if (f.id === undefined || f.id === null) {
      return false;
    }
    return String(f.id).padStart(3, '0') !== ANTARCTICA_NUMERIC_ID;
  });
})();

export const WorldMap = ({ id, data, graph }: WorldMapProps) => {
  const { config } = useConfig();
  const { locale } = config.settings;
  const [hover, setHover] = useState<{
    code: string;
    x: number;
    y: number;
  } | null>(null);

  const colors = useMemo(
    () => ({
      base:
        getWidgetStyle(['color-world-map', 'color-primary'], config) ||
        '#dbe1f6',
      darker:
        getWidgetStyle(['color-world-map-dark', 'color-secondary'], config) ||
        '#899de2'
    }),
    [config]
  );

  const max = useMemo(
    () => Object.values(data).reduce((acc, v) => (v > acc ? v : acc), 0),
    [data]
  );

  const pathGen = useMemo(() => {
    const projection = geoMercator().fitSize([VIEW_WIDTH, VIEW_HEIGHT], {
      type: 'FeatureCollection',
      features: COUNTRIES
    });
    return geoPath(projection);
  }, []);

  if (Object.keys(data).length === 0) {
    return <GraphEmptyMessage />;
  }

  const fillFor = (alpha2: string | undefined) => {
    if (!alpha2 || max === 0) {
      return colors.base;
    }
    const value = data[alpha2];
    if (!value) {
      return colors.base;
    }
    // Polynomial scale (k=0.5) — matches jvectormap's default normalizeFunction.
    const t = Math.sqrt(value / max);
    return mix(t, colors.darker, colors.base);
  };

  const hoverName = hover
    ? new Intl.DisplayNames([locale], { type: 'region' }).of(hover.code)
    : null;
  const hoverValue = hover ? formatNumber(data[hover.code] || 0, locale) : null;

  // Event delegation: one handler on the SVG reads the country code off the
  // hovered <path>'s data attribute. Avoids attaching ~177 listeners and
  // keeps each <path> a static element (no a11y rule violations).
  const handleMouseMove = (e: React.MouseEvent<SVGElement>) => {
    const target = e.target as SVGElement;
    const code = target.getAttribute('data-alpha2');
    if (code) {
      setHover({ code, x: e.clientX, y: e.clientY });
    } else if (hover) {
      setHover(null);
    }
  };

  return (
    <>
      <div
        className={styles['world-map']}
        data-testid='world-map'
        aria-hidden
        style={{
          height: graph.options?.height || graphDefaults.world_map.height || ''
        }}
      >
        <svg
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          preserveAspectRatio='xMidYMid meet'
          className={styles['world-map-svg']}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHover(null)}
        >
          <title>{graph.title || 'World map'}</title>
          {COUNTRIES.map(f => {
            const numericId = String(f.id).padStart(3, '0');
            const alpha2 = isoNumericToAlpha2[numericId];
            return (
              <path
                key={String(f.id)}
                d={pathGen(f) || ''}
                fill={fillFor(alpha2)}
                data-alpha2={alpha2}
                className={styles['world-map-region']}
              />
            );
          })}
        </svg>
        {hover && (
          <div
            className={styles['world-map-tooltip-position']}
            style={{ left: hover.x, top: hover.y }}
          >
            <ul className={styles['world-map-tooltip']}>
              <li>{hoverName}</li>
              <li>{hoverValue}</li>
            </ul>
          </div>
        )}
      </div>
      <WorldMapTable id={id} data={data} graph={graph} />
    </>
  );
};
