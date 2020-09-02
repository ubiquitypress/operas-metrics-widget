import React from 'react';
import Chart from 'react-apexcharts';

const LineGraph = ({ seriesData = [], xAxisCategories = [] }) => {
  if (process.env.NODE_ENV === 'test') return null;

  // One series only - with the data provided
  const series = [{ data: seriesData }];

  // Options for the graph
  const options = {
    dataLabels: {
      enabled: false
    },
    chart: {
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
      enabled: false
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
      tickAmount: 1
    }
  };

  return (
    <Chart
      series={series}
      type='area'
      width='100%'
      height='200px'
      options={options}
    />
  );
};

export default LineGraph;
