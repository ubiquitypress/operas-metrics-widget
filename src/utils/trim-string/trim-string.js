import getString from '../../localisation/get-string/get-string';

const trimString = (str, length) => {
  try {
    if (str.length <= length) return str;
    return getString('other.trimmed_string', { string: str.substr(0, length) });
  } catch (err) {
    return null;
  }
};

export default trimString;
