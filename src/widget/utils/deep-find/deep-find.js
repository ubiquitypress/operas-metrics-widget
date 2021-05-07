// Returns the value within an object, or `undefined` if it does not exist
const deepFind = (obj, path) => {
  const [next, ...rest] = path.split('.');

  if (rest.length === 0) return obj[path];
  return obj[next] ? deepFind(obj[next], rest.join('.')) : undefined;
};

export default deepFind;
