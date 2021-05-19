import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './panel.module.scss';
import { useConfig } from '../../contexts/config';
import deepFind from '../../utils/deep-find';
import Graph from '../graph';
import { useTranslation } from '../../contexts/i18n';
import Loading from '../loading';
import OperasDefinition from '../operas-definition';

const Panel = ({ name, active }) => {
  const config = useConfig();
  const { t } = useTranslation();
  const [status, setStatus] = useState({
    opened: false,
    loaded: 0
  });
  const [data] = useState({
    graphs: deepFind(config, `tabs.${name}.graphs`),
    definition: deepFind(config, `tabs.${name}.operas_definition`)
  });
  const isLoaded = status.loaded === Object.keys(data.graphs).length;

  // Called when a graph is fully loaded
  const onGraphReady = () =>
    setStatus(prevState => ({ ...prevState, loaded: prevState.loaded + 1 }));

  // Once the panel has been opened once, keep its content permanently rendered
  useEffect(() => {
    if (active && !status.opened) setStatus({ ...status, opened: true });
  }, [active]);

  return (
    <div
      className={`${styles.panel}${!active ? ' hidden' : ''}`}
      tabIndex='0'
      role='tabpanel'
      id={`mw-tabpanel-${name}`}
      aria-labelledby={`mw-tab-${name}`}
    >
      {(active || status.opened) && (
        <>
          {!isLoaded && <Loading message={t('loading.graphs')} />}

          <div className={isLoaded ? '' : 'hidden'}>
            {Object.entries(data.graphs).map(([type, options]) => (
              <Graph
                key={type}
                type={type}
                tab={name}
                options={options}
                onReady={onGraphReady}
              />
            ))}
            <OperasDefinition link={data.definition} />
          </div>
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
