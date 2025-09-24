import type { ChartTooltipContext, Config, LineGraph } from '@/types';
import { formatNumber } from '@/utils';

interface TooltipElements {
  tooltipId: string;
  tooltipContainerId: string;
  tooltipDateId: string;
  tooltipValueId: string;
  tooltipScopeId: string;
}

export const tooltipConfig = (
  context: ChartTooltipContext,
  elements: TooltipElements,
  config: Config,
  graph: LineGraph
) => {
  const { tooltipId, tooltipDateId, tooltipValueId, tooltipScopeId } = elements;

  const tooltipEl = document.querySelector(`#${tooltipId}`);
  const tooltipModel = context.tooltip;

  // Make sure we have the tooltip element
  if (!tooltipEl || !(tooltipEl instanceof HTMLElement)) {
    return;
  }

  // Hide if should not be visible
  if (tooltipModel.opacity === 0) {
    tooltipEl.style.opacity = '0';
    return;
  }

  // Render the tooltip
  // (the HTML is already rendered by the LineGraph component)
  if (tooltipModel.body) {
    const [firstDataPoint] = tooltipModel.dataPoints;
    if (!firstDataPoint) {
      return;
    }

    const { raw, label, dataset } = firstDataPoint;

    // Set the date text
    const dateEl = document.querySelector(`#${tooltipDateId}`);
    if (dateEl) {
      dateEl.innerHTML = label;
    }

    // Set the value text
    const valueEl = document.querySelector(`#${tooltipValueId}`);
    if (valueEl) {
      valueEl.innerHTML = formatNumber(raw, config.settings.locale);
    }

    // Set the scope text
    const scopeEl = document.querySelector(`#${tooltipScopeId}`);
    if (scopeEl && graph.config?.stacked) {
      scopeEl.innerHTML = dataset.label;
    }

    // Set the opacity
    tooltipEl.style.opacity = '1';

    // Set the position
    const { offsetTop, offsetLeft } = context.chart.canvas;
    const position = context.chart.canvas.getBoundingClientRect();
    const left = offsetLeft + tooltipModel.caretX;
    const right = offsetLeft + (position.width - tooltipModel.caretX);
    const top = offsetTop + 5 + tooltipModel.caretY;

    // Set the top position
    tooltipEl.style.top = `${top}px`;

    // Set the left/right position
    if (left > position.width / 1.5) {
      tooltipEl.style.left = 'unset';
      tooltipEl.style.right = `${right}px`;
    } else {
      tooltipEl.style.left = `${left}px`;
      tooltipEl.style.right = 'unset';
    }
  }
};
