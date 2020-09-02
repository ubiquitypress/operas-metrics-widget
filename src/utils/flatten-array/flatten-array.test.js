import flattenArray from './flatten-array';

test('returns the original array if one is provided', () => {
  const arr = [1, 2, 3, 4, 'a', 'b', 'c', 'd'];
  expect(flattenArray(arr)).toStrictEqual(arr);
});

test('returns a single array if an array of arrays is provided', () => {
  const arrs = [
    [1, 2, 3, 4],
    ['a', 'b', 'c', 'd']
  ];
  const flattened = [1, 2, 3, 4, 'a', 'b', 'c', 'd'];
  expect(flattenArray(arrs)).toStrictEqual(flattened);
});

test('returns a singlearray of an array contains multiple arrays within arrays', () => {
  const arrs = [[[[1], 2], 3], 4];
  const flattened = [1, 2, 3, 4];
  expect(flattenArray(arrs)).toStrictEqual(flattened);
});
