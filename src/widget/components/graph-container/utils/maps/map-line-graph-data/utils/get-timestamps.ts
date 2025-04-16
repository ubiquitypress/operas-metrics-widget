import type { APIEvent, Config, DatasetRange, GraphData } from '@/types';
import { eachDayOfInterval, format } from 'date-fns';

export interface Timestamp {
  raw: RawData;
  formatted: Record<DatasetRange, string[]>;
}

interface RawData {
  days: APIEvent['timestamp'][];
  months: APIEvent['timestamp'][];
  years: APIEvent['timestamp'][];
}

/** 
  Returns an object of all unique timestamps in the given data
  @param data - The GraphData object to get the timestamps from
  @param config - The widget Config object to get the locale from
*/
export const getTimestamps = (
  data: GraphData,
  config: Config
): Timestamp | null => {
  // Guard clause: if there is no data, return null
  if (data.merged.length === 0) {
    return null;
  }

  // Create an object to store all unique timestamps - this isn't
  // used for anything other than speeding up the process of
  // checking if a timestamp already exists
  const unique: Record<APIEvent['timestamp'], number> = {};

  // Create an array to store each timestamp
  let timestamps: string[] = [];

  // Loop through each event
  for (const event of data.merged) {
    // Get the timestamp
    const { timestamp } = event;

    // Check if the timestamp is unique
    if (timestamp && !unique[timestamp]) {
      unique[timestamp] = 1;

      // Push the timestamp to the array
      timestamps.push(timestamp);
    }
  }

  // Sort the timestamps by date
  timestamps.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  // After sorting the timestamps, get the latest timestamp
  const latestTimestamp = new Date(timestamps.at(-1) || '');

  // Get today's date
  const currentDate = new Date();

  // Check if the latest timestamp is before the current date
  if (latestTimestamp < currentDate) {
    // If it is, loop through each day from the latest timestamp to the current date
    const additionalTimestamps = eachDayOfInterval({
      start: latestTimestamp,
      end: currentDate
    }).map(date => format(date, 'yyyy-MM-dd'));

    // Concatenate the additional timestamps to the timestamps array
    timestamps = [...timestamps, ...additionalTimestamps];
  }

  // We now have an array of every possible timestamp. In order to optimise this,
  // we'll create a `raw` object of non-formatted timestamps which contains the
  // timestamps either by day (everything above), or by month/year. This allows the
  // mapping function to choose which format to use, rather than having to loop
  // through every timestamp and format it.
  const rawData: RawData = {
    days: [],
    months: [],
    years: []
  };
  const prev = { month: -1, year: -1 }; // 0 is a valid month/year
  for (const timestamp of timestamps) {
    const date = new Date(timestamp);
    date.setUTCMinutes(60);
    date.setUTCDate(1);
    const month = date.getMonth();
    const year = date.getFullYear();

    // Add the timestamp to the `rawData` object
    rawData.days.push(timestamp.split('T')[0]);

    // If the month has changed, add it to the `rawData` object
    if (month !== prev.month) {
      rawData.months.push(timestamp.split('-').slice(0, 2).join('-'));
    }

    // If the year has changed, add it to the `rawData` object
    if (year !== prev.year) {
      rawData.years.push(timestamp.split('-')[0]);
    }

    // Update the `prev` object
    prev.month = month;
    prev.year = year;
  }

  // Return the timestamps, localised both with and without the day
  return {
    raw: rawData,
    formatted: {
      days: rawData.days.map(timestamp =>
        new Date(timestamp).toLocaleDateString(config.settings.locale, {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })
      ),
      months: rawData.months.map(timestamp =>
        new Date(timestamp).toLocaleDateString(config.settings.locale, {
          month: 'short',
          year: 'numeric'
        })
      ),
      years: rawData.years.map(timestamp =>
        new Date(timestamp).toLocaleDateString(config.settings.locale, {
          year: 'numeric'
        })
      )
    }
  };
};
