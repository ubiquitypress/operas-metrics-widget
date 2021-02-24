import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import loadExternalScript from '../../../utils/load-external-script/load-external-script';

const LineGraph = ({
  seriesData = [],
  seriesName = '',
  xAxisCategories = []
}) => {
  const [graph, setGraph] = useState(null);
  if (process.env.NODE_ENV === 'test') return null;

  const options = {
    series: [{ name: seriesName, data: seriesData }],
    dataLabels: {
      enabled: false
    },
    chart: {
      type: 'area',
      height: 250,
      animations: {
        enabled: false
      },
      toolbar: {
        show: false
      },
      selection: {
        enabled: false
      },
      zoom: {
        enabled: false
      }
    },
    tooltip: {
      enabled: true
    },
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
    },
    xaxis: {
      categories: xAxisCategories
    },
    yaxis: {
      tickAmount: 1,
      labels: {
        formatter: value => Math.round(value) // prevents numbers appearing with decimals (6.0, 7.0, ..)
      }
    }
  };

  // Load the apexcharts script from the CDN, and
  // then make a new graph with the provided data
  useEffect(() => {
    if (!graph) {
      loadExternalScript('apexcharts', () => {
        setGraph(
          // eslint-disable-next-line no-undef
          new ApexCharts(document.querySelector('#line-graph'), options)
        );
      });
    } else {
      graph.render();
    }
  }, [graph, seriesData]);

  return <div id='line-graph' />;
};

LineGraph.propTypes = {
  seriesData: PropTypes.arrayOf(PropTypes.number),
  seriesName: PropTypes.string,
  xAxisCategories: PropTypes.arrayOf(PropTypes.string)
};
LineGraph.defaultProps = {
  seriesData: [],
  seriesName: '',
  xAxisCategories: []
};

export default LineGraph;
