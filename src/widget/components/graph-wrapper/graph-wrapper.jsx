import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './graph-wrapper.module.scss';
import { useConfig } from '../../contexts/config';
import deepFind from '../../utils/deep-find';

const GraphWrapper = ({ width = 100, label, hideLabel, children }) => {
  const config = useConfig();
  const [windowSmall, setWindowSmall] = useState(false);
  const resizeWidth = deepFind(config, 'settings.one_per_row_width');

  // Resize the graph to be 100% width if the window is smaller than the config allows
  const onResize = () => setWindowSmall(window.innerWidth <= resizeWidth);
  useEffect(() => {
    if (resizeWidth && resizeWidth > 0) {
      onResize();
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }
    return () => null;
  }, []);

  return (
    <div
      className={styles['graph-wrapper']}
      style={{ width: windowSmall ? '100%' : `${width}%` }}
    >
      <h2
        className={`${styles['graph-wrapper-label']}${
          hideLabel ? ' visually-hidden' : ''
        }`}
      >
        {label}
      </h2>
      {children}
    </div>
  );
};

GraphWrapper.propTypes = {
  width: PropTypes.number,
  label: PropTypes.string.isRequired,
  hideLabel: PropTypes.bool,
  children: PropTypes.node.isRequired
};
GraphWrapper.defaultProps = {
  width: 100,
  hideLabel: false
};

export default GraphWrapper;
