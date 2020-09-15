import formatTimestamp from './format-timestamp';

test('returns a timestamp formatted correctly', () => {
  const timestamps = [
    {
      timestamp: '2020-09-08T14:04:39.445Z',
      expected_short: 'Sep 2020',
      expected_long: '8 Sep 2020'
    },
    {
      timestamp: '1998-07-29T20:00:00.000Z',
      expected_short: 'Jul 1998',
      expected_long: '29 Jul 1998'
    },
    {
      timestamp: '2012-05-29T21:00:00.000Z',
      expected_short: 'May 2012',
      expected_long: '29 May 2012'
    },
    {
      timestamp: '2050-01-01T00:00:00.000Z',
      expected_short: 'Jan 2050',
      expected_long: '1 Jan 2050'
    }
  ];

  timestamps.forEach(ts => {
    expect(formatTimestamp(ts.timestamp, 'short')).toBe(ts.expected_short);
    expect(formatTimestamp(ts.timestamp, 'long')).toBe(ts.expected_long);
  });
});
