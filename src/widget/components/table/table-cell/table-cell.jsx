import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './table-cell.module.scss';

const TableCell = ({ head, children, className }) => {
  const Component = head ? 'th' : 'td';

  return (
    <Component
      className={classNames(
        styles['table-cell'],
        head ? 'th' : 'td',
        className
      )}
      scope={head ? 'col' : 'row'}
      data-testid='table-cell'
    >
      {children}
    </Component>
  );
};

TableCell.propTypes = {
  head: PropTypes.bool,
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

TableCell.defaultProps = {
  head: false,
  className: undefined
};

export default TableCell;
