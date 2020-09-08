import getString from '../../localisation/get-string/get-string';

const formatTimestamp = timestamp => {
  const date = new Date(timestamp);
  const months = getString('dates.months').split(',');

  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return getString('dates.format', { month, year });
};

export default formatTimestamp;
