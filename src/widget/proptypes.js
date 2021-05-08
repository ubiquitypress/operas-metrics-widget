import PropTypes from 'prop-types';

export const graphPropTypes = {
  width: PropTypes.number,
  hide_label: PropTypes.bool,
  uris: PropTypes.arrayOf(PropTypes.string)
};

export const configPropTypes = {
  settings: PropTypes.shape({
    base_url: PropTypes.string.isRequired,
    work_uri: PropTypes.string.isRequired,
    language: PropTypes.string,
    default_tabs: PropTypes.arrayOf(PropTypes.string),
    localise_country_codes: PropTypes.bool,
    one_per_column_width: PropTypes.number
  }),
  locales: PropTypes.objectOf(PropTypes.any),
  tabs: PropTypes.objectOf(
    PropTypes.shape({
      nav_counts: PropTypes.arrayOf(PropTypes.string),
      graphs: PropTypes.objectOf(PropTypes.shape(graphPropTypes))
    })
  )
};
