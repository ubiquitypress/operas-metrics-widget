import ids from './ids.json';
import getVersion from '../get-version/get-version';

// eslint-disable-next-line consistent-return
const loadExternalScript = (id, callback) => {
  // Make sure the script is predefined
  if (!ids[id])
    return console.error(
      `Could not find external script '${id}'. Does it exist in ids.json?`
    );
  if (!callback)
    return console.error(`Missing callback on loading external script '${id}'`);

  // Has the script already been inserted?
  const existingScript = document.getElementById(id);
  if (existingScript) {
    // Is it already loaded?
    if (existingScript.dataset.loaded === 'true') return callback();

    // Listen for the DOM event change, from `[loaded='false']` to `[loaded='true']`
    const MutationObserver =
      window.MutationObserver || window.WebKitMutationObserver;
    const observer = new MutationObserver(() => callback());
    observer.observe(existingScript, {
      subtree: true,
      attributes: true
    });
  } else {
    // Replace the version dynamically
    ids[id] = ids[id].replace(
      '{version}',
      process.env.NODE_ENV === 'development' ? 'dev' : getVersion()
    );

    // Create a new script
    const script = document.createElement('script');
    script.src = ids[id];
    script.id = id;
    script.dataset.loaded = false;
    document.body.appendChild(script);
    script.onload = () => {
      script.dataset.loaded = true;
      callback();
    };
  }
};

export default loadExternalScript;
