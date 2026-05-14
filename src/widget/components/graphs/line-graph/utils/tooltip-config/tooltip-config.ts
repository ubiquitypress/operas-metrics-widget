import type { ChartTooltipContext, Config, LineGraph } from '@/types';
import { formatNumber } from '@/utils';
import styles from '../../line-graph.module.scss';

interface TooltipElements {
  tooltipId: string;
  totalLabel: string;
}

/**
 * Renders a unified per-date tooltip showing every dataset at the hovered
 * x-position, plus an optional total when the chart is in stacked mode.
 * Chart.js's `mode: 'index'` ensures `tooltipModel.dataPoints` contains
 * one entry per dataset at the hovered date.
 */
export const tooltipConfig = (
  context: ChartTooltipContext,
  elements: TooltipElements,
  config: Config,
  graph: LineGraph
) => {
  const { tooltipId, totalLabel } = elements;
  const tooltipEl = document.getElementById(tooltipId);
  const tooltipModel = context.tooltip;

  if (!tooltipEl) {
    return;
  }

  if (tooltipModel.opacity === 0) {
    tooltipEl.style.opacity = '0';
    return;
  }

  if (!tooltipModel.body || tooltipModel.dataPoints.length === 0) {
    return;
  }

  const { dataPoints } = tooltipModel;
  const date = dataPoints[0]?.label ?? '';
  const showTotal = graph.config?.stacked && dataPoints.length > 1;

  // For stacked charts, figure out which band the cursor is in so the
  // matching row can be highlighted. dataPoints arrive in dataset
  // declaration order (= bottom-to-top in the stack), so walking forward
  // accumulating values gives each band's [min, max] in data space.
  let activeDatasetIndex = -1;
  if (graph.config?.stacked) {
    const valueAtCursor = context.chart.scales.y.getValueForPixel(
      tooltipModel.caretY
    );
    if (typeof valueAtCursor === 'number') {
      let cumulative = 0;
      for (const dp of dataPoints) {
        const v = (dp.raw as number) || 0;
        if (valueAtCursor >= cumulative && valueAtCursor <= cumulative + v) {
          activeDatasetIndex = dp.datasetIndex;
          break;
        }
        cumulative += v;
      }
    }
  }

  // Display order: top of stack first, so the tooltip's vertical order
  // mirrors the chart. Trade-off acknowledged: this reads opposite to
  // the legend's left-to-right order.
  const orderedPoints = [...dataPoints].reverse();

  // Rebuild the tooltip contents on every move. Use textContent +
  // createElement so dataset labels (which come from user config) can't
  // inject markup.
  while (tooltipEl.firstChild) {
    tooltipEl.removeChild(tooltipEl.firstChild);
  }

  const dateEl = document.createElement('div');
  dateEl.className = styles['line-graph-tooltip-date'];
  dateEl.textContent = date;
  tooltipEl.appendChild(dateEl);

  for (const dp of orderedPoints) {
    const row = document.createElement('div');
    const isActive = dp.datasetIndex === activeDatasetIndex;
    row.className = isActive
      ? `${styles['line-graph-tooltip-row']} ${styles['line-graph-tooltip-row-active']}`
      : styles['line-graph-tooltip-row'];
    // Stamped here so the canvas mousemove listener (in line-graph.tsx)
    // can find rows by index and toggle the active class on pure
    // vertical cursor movement, which chart.js's external callback does
    // not fire for in mode:'index'.
    row.dataset.datasetIndex = String(dp.datasetIndex);

    const swatch = document.createElement('span');
    swatch.className = styles['line-graph-tooltip-swatch'];
    const color = dp.dataset.borderColor;
    if (typeof color === 'string') {
      swatch.style.background = color;
    }
    row.appendChild(swatch);

    const labelEl = document.createElement('span');
    labelEl.className = styles['line-graph-tooltip-label'];
    labelEl.textContent = dp.dataset.label ?? '';
    row.appendChild(labelEl);

    const valueEl = document.createElement('span');
    valueEl.className = styles['line-graph-tooltip-value'];
    valueEl.textContent = formatNumber(
      dp.raw as number,
      config.settings.locale
    );
    row.appendChild(valueEl);

    tooltipEl.appendChild(row);
  }

  if (showTotal) {
    const total = dataPoints.reduce(
      (acc, dp) => acc + ((dp.raw as number) || 0),
      0
    );
    const totalRow = document.createElement('div');
    totalRow.className = styles['line-graph-tooltip-total'];

    const labelEl = document.createElement('span');
    labelEl.className = styles['line-graph-tooltip-label'];
    labelEl.textContent = totalLabel;
    totalRow.appendChild(labelEl);

    const valueEl = document.createElement('span');
    valueEl.className = styles['line-graph-tooltip-value'];
    valueEl.textContent = formatNumber(total, config.settings.locale);
    totalRow.appendChild(valueEl);

    tooltipEl.appendChild(totalRow);
  }

  tooltipEl.style.opacity = '1';

  // Position the tooltip near the cursor while keeping it inside the
  // chart container — important on narrow viewports where the tooltip
  // is wide relative to the chart and a naive caret-relative position
  // can spill off either edge.
  const { offsetTop, offsetLeft } = context.chart.canvas;
  const position = context.chart.canvas.getBoundingClientRect();
  const tooltipWidth = tooltipEl.offsetWidth;
  const cursorX = tooltipModel.caretX;

  // Prefer right-of-cursor; flip to the left when that would overflow,
  // then clamp within the canvas bounds either way.
  let leftPos = cursorX + 8;
  if (leftPos + tooltipWidth > position.width) {
    leftPos = cursorX - tooltipWidth - 8;
  }
  leftPos = Math.max(0, Math.min(leftPos, position.width - tooltipWidth));

  tooltipEl.style.top = `${offsetTop + 5 + tooltipModel.caretY}px`;
  tooltipEl.style.left = `${offsetLeft + leftPos}px`;
  tooltipEl.style.right = 'unset';
};
