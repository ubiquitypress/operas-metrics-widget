import type { Dataset } from './graphs';

export interface ChartTooltipDataPoint {
  raw: number;
  label: string;
  dataset: {
    label?: string;
  };
}

export interface ChartTooltipModel {
  opacity: number;
  body?: Array<{ lines: string[] }>;
  dataPoints: ChartTooltipDataPoint[];
  caretX: number;
  caretY: number;
}

export interface ChartCanvasElement extends HTMLCanvasElement {
  offsetTop: number;
  offsetLeft: number;
}

export interface ChartTooltipContext {
  chart: {
    canvas: ChartCanvasElement;
  };
  tooltip: ChartTooltipModel;
}

export interface ChartLegendOptions {
  display: boolean;
}

export interface ChartScaleTickOptions {
  maxTicksLimit?: number;
  callback?: (value: number) => string;
  precision?: number;
}

export interface ChartScaleOptions {
  ticks?: ChartScaleTickOptions;
  stacked?: boolean;
  beginAtZero?: boolean;
}

export interface ChartScalesOptions {
  x?: ChartScaleOptions;
  y?: ChartScaleOptions;
}

export interface ChartTooltipOptions {
  enabled: boolean;
  intersect: boolean;
  external: (context: ChartTooltipContext) => void;
}

export interface ChartPluginsOptions {
  legend: ChartLegendOptions;
  tooltip: ChartTooltipOptions;
}

export interface ChartDatasetConfig extends Dataset {
  pointRadius: number;
  pointHitRadius: number;
  borderWidth: number;
  borderColor: string;
  backgroundColor: string | CanvasGradient;
  fill: 'origin' | 'start' | 'end' | boolean;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDatasetConfig[];
}

export interface ChartOptions {
  animation: boolean;
  maintainAspectRatio: boolean;
  scales: ChartScalesOptions;
  cubicInterpolationMode: 'monotone' | 'default';
  borderWidth: number;
  plugins: ChartPluginsOptions;
}

export interface ChartConfiguration {
  type: 'line';
  data: ChartData;
  options: ChartOptions;
}

export interface ChartInstance {
  destroy(): void;
}

export type ChartConstructor = new (
  ctx: CanvasRenderingContext2D,
  config: ChartConfiguration
) => ChartInstance;
