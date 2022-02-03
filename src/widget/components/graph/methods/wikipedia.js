const wikipediaArticles = ({ uris }) => {
  // Fetch only URIs that contain an `event_uri`, and return
  // an array of just the `event_uri` fields
  const items = uris.filter(item => item.event_uri).map(item => item.event_uri);

  // Sort alphabetically
  items.sort();

  // Convert into an array of objects
  const data = items.map(uri => {
    // Replace the key to be a string
    let name = uri.replace(/.*\/wiki\//g, '');
    name = name.replace(/_/g, ' ');
    name = decodeURIComponent(name);

    return { name, link: uri };
  });

  return { data };
};

export default wikipediaArticles;
