import React from 'react';
import { VectorMap } from 'react-jvectormap';

// Renders a map component, with the mapData provided. The format
// of the data should be an object with key/value pairs for the count
// of the Alpha-2 country code  ie. { GB: 10, JP: 12, US: 11 }
const MapGraph = ({ mapData = {} }) => {
  if (process.env.NODE_ENV === 'test') return null;

  return (
    <div id='world-map'>
      <VectorMap
        map={'world_mill'}
        backgroundColor='transparent'
        zoomOnScroll={false}
        containerStyle={{
          width: '100%',
          height: '200px'
        }}
        containerClassName='map'
        regionStyle={{
          initial: {
            fill: '#dce1f6',
            stroke: 'none',
            'stroke-width': 0,
            'stroke-opacity': 0,
            'pointer-events': 'none'
          },
          hover: {},
          selected: {},
          selectedHover: {}
        }}
        series={{
          regions: [
            {
              values: mapData,
              scale: ['#dce1f6', '#8596e1'],
              normalizeFunction: 'polynomial'
            }
          ]
        }}
      />
    </div>
  );
};

export default MapGraph;
