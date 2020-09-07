const getTwitterIdFromURI = uri => {
  return uri.replace(/.*status\//g, '');
};

export default getTwitterIdFromURI;
