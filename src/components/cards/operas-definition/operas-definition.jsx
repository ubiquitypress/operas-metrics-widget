import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import CardWrapper from '../../card-wrapper/card-wrapper';
import getString from '../../../localisation/get-string/get-string';
import styles from './operas-definition.module.scss';

const OperasDefinition = ({ uris, onReady, hidden }) => {
  useEffect(() => {
    onReady();
  }, []);

  if (hidden || !uris || uris.length === 0) return null;

  return (
    <CardWrapper width={100} hideLabel data-testid='operas-definitions'>
      <a
        href={Array.isArray(uris) ? uris[0] : uris}
        target='_blank'
        rel='noopener noreferrer'
        className={styles.message}
        data-testid='operas-definition'
      >
        {getString('other.operas')}
      </a>
    </CardWrapper>
  );
};

OperasDefinition.propTypes = {
  uris: PropTypes.arrayOf(PropTypes.string).isRequired,
  hidden: PropTypes.bool,
  onReady: PropTypes.func
};
OperasDefinition.defaultProps = {
  hidden: false,
  onReady: null
};

export default OperasDefinition;
