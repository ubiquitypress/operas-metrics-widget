import React from 'react';
import PropTypes from 'prop-types';
import LinkWrapper from '../link-wrapper';
import { useTranslation } from '../../contexts/i18n';
import styles from './operas-definition.module.scss';

const OperasDefinition = ({ link }) => {
  const { t } = useTranslation();
  if (!link) return null;

  return (
    <p className={styles['operas-definition']} data-testid='operas-definition'>
      <LinkWrapper href={link}>{t('other.operas')}</LinkWrapper>
    </p>
  );
};

OperasDefinition.propTypes = {
  link: PropTypes.string
};
OperasDefinition.defaultProps = {
  link: null
};

export default OperasDefinition;
