import { GraphEmptyMessage } from '@/components/common';
import { useConfig } from '@/config';
import { useIntl } from '@/i18n';
import type {
  ChartConfiguration,
  ChartDatasetConfig,
  ChartTooltipContext,
  Dataset,
  LineGraph as ILineGraph
} from '@/types';
import { formatNumber, getWidgetStyle } from '@/utils';
import type { Chart } from 'chart.js';
import { transparentize } from 'polished';
import { useEffect } from 'react';
import styles from './line-graph.module.scss';
import { LineGraphTable } from './line-graph-table';
import { tooltipConfig } from './utils';

export interface LineGraphProps {
  id: string;
  labels: string[];
  datasets: Dataset[];
  graph: ILineGraph;
}

export const LineGraph = (props: LineGraphProps) => {
  const { id, labels, datasets, graph } = props;
  const { config } = useConfig();
  const { t } = useIntl();
  const totalLabel = t('graphs.line_graph.total_label');

  // All the IDs we need to reference the graph
  const canvasId = `${id}-line-graph`;
  const tooltipId = `${id}-line-graph-tooltip`;

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

    // Destroy any existing chart tied to this canvas before recreating
    const ChartLib = (
      globalThis as typeof globalThis & {
        Chart?: typeof import('chart.js').Chart;
      }
    ).Chart;
    if (ChartLib?.getChart) {
      ChartLib.getChart(canvas)?.destroy?.();
    }

    let chart: Chart | null = null;

    // Create the chart
    const chartDatasets: ChartDatasetConfig[] = datasets.map(
      (dataset, index) => {
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
        } satisfies ChartDatasetConfig;
      }
    );

    const chartConfig: ChartConfiguration = {
      type: 'line',
      data: {
        // Labels for the x-axis
        labels: labels,

        // Data for the graph
        datasets: chartDatasets
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

          // Custom tooltip — mode 'index' captures every dataset at the
          // hovered x-position so we can show "Series A: 2,212 / Series B:
          // 172 / Total: 2,384" rather than just one series at a time.
          tooltip: {
            enabled: false,
            mode: 'index',
            intersect: false,
            external: (context: ChartTooltipContext) =>
              tooltipConfig(context, { tooltipId, totalLabel }, config, graph)
          }
        }
      }
    };

    chart = new globalThis.Chart(ctx, chartConfig) as unknown as Chart;

    // chart.js's `external` tooltip callback only fires when the tooltip's
    // data points change — with mode:'index', that's per x-bucket, so
    // pure vertical cursor movement within the same x doesn't re-render
    // the tooltip. Hook canvas mousemove ourselves so the active-row
    // highlight tracks vertical motion in real time.
    const isStacked = !!graph.config?.stacked;
    const activeClass = styles['line-graph-tooltip-row-active'];
    const handleMouseMove = (e: MouseEvent) => {
      if (!isStacked) {
        return;
      }
      const tip = document.getElementById(tooltipId);
      if (!tip || tip.style.opacity === '0') {
        return;
      }
      const c = ChartLib?.getChart?.(canvas);
      const yScale = c?.scales?.y;
      const dps = c?.tooltip?.dataPoints;
      if (!c || !yScale || !dps || dps.length === 0) {
        return;
      }
      const valueAtCursor = yScale.getValueForPixel(e.offsetY);
      if (typeof valueAtCursor !== 'number') {
        return;
      }
      let cumulative = 0;
      let activeIndex = -1;
      for (const dp of dps) {
        const v = (dp.raw as number) || 0;
        if (valueAtCursor >= cumulative && valueAtCursor <= cumulative + v) {
          activeIndex = dp.datasetIndex;
          break;
        }
        cumulative += v;
      }
      for (const row of tip.querySelectorAll<HTMLElement>(
        '[data-dataset-index]'
      )) {
        const idx = Number(row.dataset.datasetIndex);
        row.classList.toggle(activeClass, idx === activeIndex);
      }
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      chart?.destroy();
      chart = null;
    };
  }, [
    canvasId,
    colors,
    config,
    datasets,
    graph,
    labels,
    tooltipId,
    totalLabel
  ]);

  if (datasets.length === 0) {
    return <GraphEmptyMessage />;
  }
  return (
    <div className={styles['line-graph-container']}>
      {/* Canvas and tooltip. The tooltip is populated imperatively by
          chart.js's `external` callback (see tooltip-config.ts). */}
      <canvas id={canvasId} className={styles['line-graph']} aria-hidden />
      <div
        id={tooltipId}
        className={styles['line-graph-tooltip']}
        aria-hidden
      />

      {/* Render contents into a visually hidden table for screen readers */}
      <LineGraphTable {...props} />
    </div>
  );
};
