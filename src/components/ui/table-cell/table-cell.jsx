import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './table-cell.module.scss';

const TableCell = ({ isHead, isHidden, children }) => {
  const Component = isHead ? 'th' : 'td';

  return (
    <Component
      className={classnames(
        styles.tableCell,
        classnames({
          [styles.th]: isHead,
          [styles.td]: !isHead,
          'visually-hidden': isHidden
        })
      )}
      scope={isHead ? 'col' : 'row'}
      data-testid='table-cell'
    >
      {children}
    </Component>
  );
};

TableCell.propTypes = {
  isHead: PropTypes.bool,
  isHidden: PropTypes.bool,
  children: PropTypes.node.isRequired
};

TableCell.defaultProps = {
  isHead: false,
  isHidden: false
};

export default TableCell;
