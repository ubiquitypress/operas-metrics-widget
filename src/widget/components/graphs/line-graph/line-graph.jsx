import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import loadScript from '../../../utils/load-script';
import styles from './line-graph.module.scss';

const LineGraph = ({ data, onReady }) => {
  const { seriesData, seriesName, xAxisCategories } = data;

  const options = {
    series: [{ name: seriesName, data: seriesData }],
    dataLabels: { enabled: false },
    xaxis: { categories: xAxisCategories },
    yaxis: {
      tickAmount: 1,
      labels: {
        formatter: value => Math.round(value) // prevents numbers appearing with decimals (6.0, 7.0, ..)
      }
    },
    chart: {
      type: 'area',
      height: 250,
      animations: { enabled: false },
      toolbar: { show: false },
      selection: { enabled: false },
      zoom: { enabled: false }
    },
    tooltip: { enabled: true },
    fill: {
      type: 'gradient',
      colors: ['#dde1f4'],
      gradient: {
        gradientToColors: ['#ffffff'],
        shadeIntensity: 1,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0]
      }
    },
    stroke: {
      width: 1,
      colors: ['#7b8cdd']
    }
  };

  useEffect(() => {
    loadScript('apexcharts.min.js', () => {
      // eslint-disable-next-line no-undef
      const chart = new ApexCharts(
        document.querySelector(`#${seriesName}-line-graph`),
        options
      );
      chart.render();
      if (onReady) onReady();
    });
  }, []);

  return (
    <div id={`${seriesName}-line-graph`} className={styles['line-graph']} />
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
