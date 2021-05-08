import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './panel.module.scss';
import { useConfig } from '../../contexts/config';
import deepFind from '../../utils/deep-find';
import Graph from '../graph';

const Panel = ({ name, active }) => {
  const config = useConfig();
  const [opened, setOpened] = useState(false);
  const [graphs] = useState(deepFind(config, `tabs.${name}.graphs`));

  useEffect(() => {
    if (active && !opened) setOpened(true);
  }, [active]);

  return (
    <div
      className={`${styles.panel}${!active ? ' hidden' : ''}`}
      tabIndex='0'
      role='tabpanel'
      id={`mw-tabpanel-${name}`}
      aria-labelledby={`mw-tab-${name}`}
    >
      {(active || opened) && (
        <>
          {Object.entries(graphs).map(([type, options]) => (
            <Graph key={type} type={type} options={options} />
          ))}
        </>
      )}
    </div>
  );
};

Panel.propTypes = {
  name: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired
};

export default Panel;
