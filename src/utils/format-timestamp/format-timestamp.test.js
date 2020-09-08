import formatTimestamp from './format-timestamp';

test('returns a timestamp formatted correctly', () => {
  const timestamps = [
    { timestamp: '2020-09-08T14:04:39.445Z', expected: 'Sep 2020' },
    { timestamp: '1998-07-31T23:00:00.000Z', expected: 'Aug 1998' },
    { timestamp: '2012-05-29T23:00:00.000Z', expected: 'May 2012' },
    { timestamp: '2050-01-01T00:00:00.000Z', expected: 'Jan 2050' }
  ];

  timestamps.forEach(ts => {
    expect(formatTimestamp(ts.timestamp)).toBe(ts.expected);
  });
});
