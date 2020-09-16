import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import convertWidth from '../../utils/convert-width/convert-width';
import styles from './card-wrapper.module.scss';
import getMetricsConfig from '../../utils/get-metrics-config/get-metrics-config';

const CardWrapper = ({
  label,
  width = 50,
  children,
  'data-testid': testId
}) => {
  const { one_per_row_width } = getMetricsConfig().settings;
  const [windowIsSmall, setWindowIsSmall] = useState(false);

  // Listeners for window being resized. If the window width is
  // less than the `metrics_config` setting `one_per_row_width`,
  // all cards will be given a width of 100, regardless of what was
  // set in the `metrics_config` for that card's width.
  const onResize = () => {
    const w = typeof window !== 'undefined' ? window.innerWidth : null;
    setWindowIsSmall(w <= one_per_row_width);
  };
  useEffect(() => {
    if (one_per_row_width && one_per_row_width > 0) {
      onResize();
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }
    return () => null;
  }, []);

  return (
    <li
      className={styles.cardWrapper}
      style={{ width: convertWidth(windowIsSmall ? 100 : width) }}
      data-testid={testId}
    >
      {label && <h2>{label}</h2>}
      {children}
    </li>
  );
};

export default CardWrapper;

CardWrapper.propTypes = {
  label: PropTypes.string,
  width: PropTypes.number,
  children: PropTypes.node.isRequired,
  'data-testid': PropTypes.string
};
CardWrapper.defaultProps = {
  label: null,
  width: 50,
  'data-testid': null
};
