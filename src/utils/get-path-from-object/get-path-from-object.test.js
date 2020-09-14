import getPathFromObject from './get-path-from-object';

const obj = {
  conversations: {
    greetings: {
      greeting1: 'hello',
      greeting2: 'good day'
    },
    farewell: 'goodbye'
  }
};

test('returns correct value from path', () => {
  expect(getPathFromObject(obj, 'conversations.greetings.greeting1')).toBe(
    'hello'
  );
  expect(getPathFromObject(obj, 'conversations.greetings.greeting2')).toBe(
    'good day'
  );
  expect(getPathFromObject(obj, 'conversations.farewell')).toBe('goodbye');
});

test('returns an object if not end of path', () => {
  expect(getPathFromObject(obj, 'conversations.greetings')).toStrictEqual(
    obj.conversations.greetings
  );
});

test('returns `null` if a path does not exist', () => {
  expect(getPathFromObject(obj, 'conversations.greetings.cowboy')).toBe(null);
});
