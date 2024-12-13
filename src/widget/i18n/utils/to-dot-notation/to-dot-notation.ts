export type EncapsulatedStringObject = Record<string, string | object>;

/**
 * Converts an object to dot notation.
 */
export const toDotNotation = (
  object: EncapsulatedStringObject,
  prefix = ''
): Record<string, string> => {
  const result: Record<string, string> = {};

  for (const key of Object.keys(object)) {
    const newPrefix = prefix ? `${prefix}.${key}` : key;
    const value = object[key];
    if (typeof value === 'object') {
      Object.assign(
        result,
        toDotNotation(object[key] as EncapsulatedStringObject, newPrefix)
      );
    } else {
      result[newPrefix] = value;
    }
  }

  return result;
};
