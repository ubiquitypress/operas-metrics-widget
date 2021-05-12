import dayjs from 'dayjs';
import formatTimestamp from '../../../utils/format-timestamp';

const timeGraph = ({ t, tab, uris }) => {
  // Merge URIs into a single object
  const dates = {};
  uris.forEach(({ timestamp, value }) => {
    if (timestamp && value)
      dates[timestamp] = dates[timestamp] ? dates[timestamp] + value : value;
  });

  // Sort the data into an array to find the earliest entry
  let data = [];
  Object.entries(dates).forEach(([key, value]) => {
    data.push({ key, value });
  });
  data.sort((a, b) => {
    if (a.key < b.key) return -1;
    if (a.key > b.key) return 1;
    return 0;
  });

  if (data.length > 0) {
    // If there is only one item, add a zero value for the previous month
    if (data.length === 1) {
      const prevMonth = dayjs(new Date(data[0].key))
        .subtract(1, 'month')
        .toISOString();
      data.push({ key: prevMonth, value: 0 });
    }

    // Determine the number of months between the first metric and today
    const initialDate = new Date(data[0].key);
    const monthsDiff = dayjs(new Date()).diff(initialDate, 'month', true);
    const countDays = monthsDiff <= 0.25; // show days instead of months if data is only 1 week old

    // Make a dictionary of each month between
    const months = {};
    if (!countDays) {
      for (let i = 0; i <= Math.floor(monthsDiff); i += 1) {
        const [year, month] = dayjs(initialDate)
          .add(i, 'months')
          .toISOString()
          .split('-');
        months[`${year}-${month}`] = 0;
      }
    }

    // Accumulate the data into the months dictionary
    data.forEach(({ key, value }) => {
      const [year, month, day] = key.split('-');
      const field = !countDays ? `${year}-${month}` : `${year}-${month}-${day}`;
      months[field] = months[field] ? months[field] + value : value;
    });

    // Sort into an array again
    data = [];
    Object.entries(months).forEach(([key, value]) => {
      data.push({ key, value });
    });
    data.sort((a, b) => {
      if (a.key < b.key) return -1;
      if (a.key > b.key) return 1;
      return 0;
    });

    // Aggregate the data
    data.forEach((item, index) => {
      const aggregate =
        index === 0 ? item.value : item.value + data[index - 1].value;
      data[index] = {
        ...data[index],
        key: formatTimestamp(t, data[index].key, countDays ? 'long' : 'short'),
        value: aggregate
      };
    });
  }

  // Pull the axes
  const seriesData = [];
  const xAxisCategories = [];
  data.forEach(({ key, value }) => {
    seriesData.push(value);
    xAxisCategories.push(key);
  });

  return {
    data: { seriesData, seriesName: t(`tabs.${tab}`), xAxisCategories }
  };
};

export default timeGraph;
