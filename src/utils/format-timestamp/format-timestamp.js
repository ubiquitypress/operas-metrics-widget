import getString from '../../localisation/get-string/get-string';

const formatTimestamp = (timestamp, format) => {
  const date = new Date(timestamp);
  const months = getString('dates.months').split(',');

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return getString(
    format === 'long' ? 'dates.format_long' : 'dates.format_short',
    { day, month, year }
  );
};

export default formatTimestamp;
