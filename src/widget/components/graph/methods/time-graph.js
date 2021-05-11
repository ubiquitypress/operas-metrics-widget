import formatTimestamp from '../../../utils/format-timestamp';

// TODO: Can we clean this up?
const timeGraph = ({ t, uris, tab }) => {
  // Make a key/value dictionary for each date
  const dates = {};
  uris.forEach(item => {
    const date = item.timestamp;
    if (date) dates[date] = dates[date] ? dates[date] + item.value : item.value;
  });

  // There is no data
  if (Object.keys(dates).length === 0) return {};

  // Dates should already be in order, but sort them just to be sure.
  // This function will sort by the oldest dates first
  const sorted = [];
  Object.keys(dates).forEach(date => {
    sorted.push({ key: date, value: dates[date] });
  });
  sorted.sort((a, b) => {
    if (a.key < b.key) return -1;
    if (a.key > b.key) return 1;
    return 0;
  });

  // Make sure we have no missing data for a month
  const allDates = [];
  const uniqueDates = []; // used for calculating the midpoint
  try {
    const [todayYear, todayMonth] = new Date().toISOString().split('-');
    let [year, month] = sorted[0].key.split('-');
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // eslint-disable-next-line no-loop-func
      const match = sorted.filter(({ key }) =>
        key.includes(`${year}-${month}`)
      );
      if (match.length > 0) match.forEach(item => allDates.push(item));
      else
        allDates.push({
          key: `${year}-${month}-01T00:00:00+0000`,
          value: 0
        });
      uniqueDates.push(`${year}-${month}-01T00:00:00+0000`);

      // Get the next date
      let nextMonth = (Number.parseInt(month, 10) + 1).toString();
      if (nextMonth === '13') nextMonth = '01';
      if (nextMonth.length === 1) nextMonth = `0${nextMonth}`;
      month = nextMonth;
      year =
        nextMonth === '01' ? (Number.parseInt(year, 10) + 1).toString() : year;

      if (year >= todayYear && month > todayMonth) break;
    }
  } catch (err) {
    // Something went wrong
    // eslint-disable-next-line no-console
    console.error(err);
    sorted.forEach(item => allDates.push(item));
  }

  // Make sure we always have at least two data points
  // since the graph will render as empty if there is only one
  if (allDates.length === 1) {
    const dayBefore = new Date(sorted[0].key);
    dayBefore.setDate(dayBefore.getDate() - 1);
    allDates.unshift({ key: dayBefore.toISOString(), value: 0 });
  }

  // Go through each item to make it cumulative
  allDates.forEach((item, i) => {
    if (i > 0) allDates[i].value += allDates[i - 1].value;
  });

  // Determine the xAxis categories
  const xAxis = Array(allDates.length)
    .fill(null)
    .map(() => '');
  xAxis[0] = formatTimestamp(t, uniqueDates[0]); // first
  xAxis[Math.floor(allDates.length / 2)] = // median
    uniqueDates.length > 2
      ? formatTimestamp(t, uniqueDates[Math.floor(uniqueDates.length / 2) - 1])
      : '';
  xAxis[allDates.length - 1] = formatTimestamp(
    t,
    uniqueDates[uniqueDates.length - 1]
  ); // last

  // Update the state with the new info
  return {
    data: {
      seriesData: allDates.map(date => date.value),
      seriesName: t(`tabs.${tab}`),
      xAxisCategories: xAxis
    }
  };
};

export default timeGraph;
