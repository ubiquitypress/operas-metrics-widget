const tweets = ({ uris }) => {
  // Only return objects that have an `event_uri` property
  let data = uris.map(uri => uri.event_uri);

  // Replace the data URIs with just IDs
  data = data.map(uri => uri.replace(/.*status\//g, ''));

  // Return the data
  return { data };
};

export default tweets;
