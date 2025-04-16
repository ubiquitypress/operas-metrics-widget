import { GraphEmptyMessage } from '@/components/common';
import { useConfig } from '@/config';
import type { Dataset, LineGraph as ILineGraph } from '@/types';
import { formatNumber, getWidgetStyle } from '@/utils';
import { transparentize } from 'polished';
import { useEffect } from 'react';
import styles from './line-graph.module.scss';
import { tooltipConfig } from './utils';

interface LineGraphProps {
  id: string;
  labels: string[];
  datasets: Dataset[];
  graph: ILineGraph;
}

export const LineGraph = (props: LineGraphProps) => {
  const { id, labels, datasets, graph } = props;
  const { config } = useConfig();

  // All the IDs we need to reference the graph
  const canvasId = `${id}-line-graph`;
  const tooltipId = `${id}-line-graph-tooltip`;
  const tooltipContainerId = `${id}-line-graph-tooltip-container`;
  const tooltipDateId = `${id}-line-graph-tooltip-date`;
  const tooltipValueId = `${id}-line-graph-tooltip-value`;
  const tooltipScopeId = `${id}-line-graph-tooltip-scope`;

  // Get the primary colours from the widget CSS
  const colors = datasets.map((_, index) => {
    const vars = [`color-line-graph-${index + 1}`, 'color-primary'];
    return getWidgetStyle(vars, config) || '#506cd3';
  });

  useEffect(() => {
    if (datasets.length === 0) {
      return;
    }

    // Get the canvas element
    const canvas = document.querySelector(`#${canvasId}`);
    if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
      return;
    }

    // Get the canvas context
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    // Create the chart
    new globalThis.Chart(ctx, {
      type: 'line',
      data: {
        // Labels for the x-axis
        labels: labels,

        // Data for the graph
        datasets: datasets.map((dataset, index) => {
          // Get the colour for the dataset
          const color = colors[index];

          // Get the various config options
          const { background = 'fill', border_width } = graph.config || {};

          // Determine the background colour
          let fill: 'origin' | 'start' | 'end' | boolean = false;
          let backgroundColor: string | CanvasGradient = 'transparent';
          if (background === 'fill') {
            fill = 'origin';
            backgroundColor = color;
          } else if (background === 'gradient') {
            fill = 'origin';
            backgroundColor = ctx.createLinearGradient(0, 0, 0, 400);
            backgroundColor.addColorStop(0, transparentize(0.6, color));
            backgroundColor.addColorStop(1, 'rgba(255, 255, 255, 0');
          }

          return {
            ...dataset,
            pointRadius: 0,
            pointHitRadius: 0,
            borderWidth: border_width ?? 1,
            borderColor: color,
            backgroundColor,
            fill
          };
        })
      },

      // Customise the legend
      options: {
        animation: false,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: { maxTicksLimit: 10 }
          },
          y: {
            stacked: true,
            beginAtZero: graph.config?.begin_at_zero,
            ticks: {
              callback: (value: number) =>
                formatNumber(value, config.settings.locale),
              precision: 0
            }
          }
        },
        cubicInterpolationMode: 'monotone',
        borderWidth: 1,
        plugins: {
          legend: {
            display: datasets.length > 1 // Only show the legend if there are multiple datasets
          },

          // Custom tooltip
          tooltip: {
            enabled: false,
            intersect: false,
            external: (context: any) =>
              tooltipConfig(
                context,
                {
                  tooltipId,
                  tooltipContainerId,
                  tooltipDateId,
                  tooltipValueId,
                  tooltipScopeId
                },
                config,
                graph
              )
          }
        }
      }
    });
  }, [
    canvasId,
    colors,
    config,
    datasets,
    graph,
    labels,
    tooltipContainerId,
    tooltipDateId,
    tooltipId,
    tooltipScopeId,
    tooltipValueId
  ]);

  if (datasets.length === 0) {
    return <GraphEmptyMessage />;
  }
  return (
    <div className={styles['line-graph-container']}>
      <canvas id={canvasId} className={styles['line-graph']} />
      <div id={tooltipId} className={styles['line-graph-tooltip']}>
        <div
          id={tooltipScopeId}
          className={styles['line-graph-tooltip-scope']}
        />
        <div
          id={tooltipContainerId}
          className={styles['line-graph-tooltip-container']}
        >
          <div
            id={tooltipDateId}
            className={styles['line-graph-tooltip-date']}
          />
          <div
            id={tooltipValueId}
            className={styles['line-graph-tooltip-value']}
          />
        </div>
      </div>
    </div>
  );
};
