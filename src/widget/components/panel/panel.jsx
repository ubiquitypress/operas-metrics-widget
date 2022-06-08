import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import styles from './panel.module.scss';
import { useConfig } from '../../contexts/config';
import deepFind from '../../utils/deep-find';
import Graph from '../graph';
import widgetEvent from '../../events/widget-event';
import { useTranslation } from '../../contexts/i18n';
import Loading from '../loading';
import OperasDefinition from '../operas-definition';
import GoogleScholarCitation from '../google-scholar-citation';

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

  // Called when one child graph is fully loaded
  const onGraphReady = () =>
    setStatus(prevState => ({ ...prevState, loaded: prevState.loaded + 1 }));

  // Once the panel has been opened once, keep its content permanently rendered
  useEffect(() => {
    if (active && !status.opened) {
      widgetEvent('tab_panel_loading', name);
      setStatus({ ...status, opened: true });
    }
  }, [active]);

  // Store the loaded status
  const isLoaded = useMemo(() => {
    if (status.loaded === Object.keys(data.graphs).length) {
      widgetEvent('tab_panel_loaded', name);
      return true;
    }
    return false;
  }, [status.loaded]);

  return (
    <div
      className={classNames(styles.panel, { hidden: !active })}
      tabIndex='0'
      role='tabpanel'
      id={`mw-tabpanel-${name}`}
      aria-labelledby={`mw-tab-${name}`}
    >
      {(active || status.opened) && (
        <>
          {!isLoaded && <Loading message={t('loading.graphs')} />}

          <div
            className={classNames(styles.graphs, { hidden: !isLoaded })}
            data-name={name}
          >
            {Object.entries(data.graphs).map(([type, options]) => (
              <Graph
                key={type}
                type={type}
                tab={name}
                options={options}
                onReady={onGraphReady}
              />
            ))}
            <GoogleScholarCitation />
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
