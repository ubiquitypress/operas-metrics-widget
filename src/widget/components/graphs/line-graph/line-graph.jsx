import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import loadScript from '../../../utils/load-script';
import { useTranslation } from '../../../contexts/i18n';
import styles from './line-graph.module.scss';

const LineGraph = ({ data, onReady }) => {
  const { seriesData, seriesName, xAxisCategories } = data;
  const { t, lang } = useTranslation();
  const graphName = seriesName && seriesName.toLowerCase().replace(/ /g, '-');

  useEffect(() => {
    if (seriesData.length === 0) return onReady();
    return loadScript('chart.js', () => {
      if (process.env.NODE_ENV !== 'test') {
        // Get the element context
        const ctx = document
          .getElementById(`${graphName}-line-graph`)
          .getContext('2d');

        // Declare the gradient fill colour
        const gradientFill = ctx.createLinearGradient(0, 0, 0, 400);
        gradientFill.addColorStop(0, 'rgba(80, 108, 211, 0.3)');
        gradientFill.addColorStop(1, 'rgba(255, 255, 255, 0');

        // eslint-disable-next-line no-new
        new window.Chart(ctx, {
          type: 'line',
          data: {
            labels: xAxisCategories,
            datasets: [
              {
                label: seriesName,
                backgroundColor: gradientFill,
                borderColor: '#506CD3',
                data: seriesData,
                fill: 'origin',
                pointRadius: 0,
                pointHitRadius: 0
              }
            ]
          },
          options: {
            animation: false,
            maintainAspectRatio: false,
            scales: {
              x: { ticks: { maxTicksLimit: 10 } },
              y: {
                ticks: {
                  callback: value => value.toLocaleString(lang),
                  precision: 0
                }
              }
            },
            cubicInterpolationMode: 'monotone',
            borderWidth: 1,
            plugins: {
              legend: { display: false },

              // Custom tooltip
              tooltip: {
                enabled: false,
                intersect: false,
                external: context => {
                  const tooltipEl = document.getElementById(
                    `${graphName}-line-graph-tooltip`
                  );
                  const tooltipModel = context.tooltip;

                  // Hide if should not be visible
                  if (tooltipModel.opacity === 0) {
                    tooltipEl.style.opacity = 0;
                    return;
                  }

                  // Render the tooltip
                  // (the HTML is rendered at the bottom of this component; we just change the content here)
                  if (tooltipModel.body) {
                    // Set the text
                    const { raw, label } = tooltipModel.dataPoints[0];
                    document.getElementById(
                      `${graphName}-line-graph-tooltip-date`
                    ).innerHTML = label;
                    document.getElementById(
                      `${graphName}-line-graph-tooltip-value`
                    ).innerHTML = raw.toLocaleString(lang);

                    // Set the opacity
                    tooltipEl.style.opacity = '1';

                    // Set the position
                    const { offsetTop, offsetLeft } = context.chart.canvas;
                    const position = context.chart.canvas.getBoundingClientRect();
                    const left = offsetLeft + tooltipModel.caretX;
                    const right =
                      offsetLeft + (position.width - tooltipModel.caretX);
                    const top = offsetTop + 5 + tooltipModel.caretY;

                    tooltipEl.style.top = `${top}px`;
                    if (left > position.width / 1.5) {
                      tooltipEl.style.left = 'unset';
                      tooltipEl.style.right = `${right}px`;
                    } else {
                      tooltipEl.style.left = `${left}px`;
                      tooltipEl.style.right = 'unset';
                    }
                  }
                }
              }
            }
          }
        });
      }

      // Chart is ready
      if (onReady) onReady();
    });
  }, []);

  if (seriesData.length === 0) return <div>{t('other.no_data')}</div>;
  return (
    <div className={styles['line-graph']}>
      {/* Graph */}
      <canvas id={`${graphName}-line-graph`} />

      {/* Tooltip */}
      <div
        id={`${graphName}-line-graph-tooltip`}
        className={styles['line-graph-tooltip']}
        data-testid='line-graph'
      >
        <div className={styles['line-graph-tooltip-content']}>
          <div
            id={`${graphName}-line-graph-tooltip-date`}
            className={styles['line-graph-tooltip-date']}
          />
          <div className={styles['line-graph-tooltip-data']}>
            <div className={styles['line-graph-tooltip-name']}>
              {seriesName}
            </div>
            <div
              id={`${graphName}-line-graph-tooltip-value`}
              className={styles['line-graph-tooltip-value']}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

LineGraph.propTypes = {
  data: PropTypes.shape({
    seriesData: PropTypes.arrayOf(PropTypes.number),
    seriesName: PropTypes.string,
    xAxisCategories: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  onReady: PropTypes.func.isRequired
};

export default LineGraph;
