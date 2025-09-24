/**
 * Returns the number of months between two dates.
 */
export const timeBetweenDates = (
  date1: Date,
  date2: Date,
  unit: 'months' | 'days'
) => {
  if (unit === 'months') {
    return monthsBetweenDates(date1, date2);
  } else {
    return daysBetweenDates(date1, date2);
  }
};

const monthsBetweenDates = (date1: Date, date2: Date) => {
  const months = (date2.getUTCFullYear() - date1.getUTCFullYear()) * 12;
  return months + date2.getUTCMonth() - date1.getUTCMonth();
};

const daysBetweenDates = (date1: Date, date2: Date) => {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
};
