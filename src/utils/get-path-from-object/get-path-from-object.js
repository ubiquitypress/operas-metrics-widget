const getPathFromObject = (obj, path) => {
  try {
    const split = path.split('.');
    let marker = obj;
    split.forEach(item => {
      marker = marker[item];
    });
    return marker || null;
  } catch (err) {
    return null;
  }
};

export default getPathFromObject;
