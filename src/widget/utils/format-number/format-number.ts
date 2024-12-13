/**
 * Formats a number using the browser's locale.
 * @param num - The number to format.
 * @param locale - The locale to use. Defaults to `'en-US'`.
 */
export const formatNumber = (num: number, locale?: string): string => {
  return num.toLocaleString(locale || 'en-US');
};
