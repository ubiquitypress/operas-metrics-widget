/**
 * Escapes regex special characters so the string can be used inside a RegExp pattern.
 * @param value - Raw string to escape before embedding in a regex.
 */
export const escapeRegex = (value: string) =>
  value.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
