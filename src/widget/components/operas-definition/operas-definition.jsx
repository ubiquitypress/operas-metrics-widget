import React from 'react';
import PropTypes from 'prop-types';
import LinkWrapper from '../link-wrapper';
import Trans from '../../contexts/i18n/trans';
import styles from './operas-definition.module.scss';

const OperasDefinition = ({ link }) => {
  if (!link) return null;

  return (
    <div
      className={styles['operas-definition']}
      data-testid='operas-definition'
    >
      <Trans
        i18nKey='other.operas'
        components={[<LinkWrapper href={link} />]}
      />
    </div>
  );
};

OperasDefinition.propTypes = {
  link: PropTypes.string
};
OperasDefinition.defaultProps = {
  link: null
};

export default OperasDefinition;
