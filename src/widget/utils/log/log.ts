/**
 * Logs a message to the console
 * @param message - The message to log
 */
export const log = {
  warn: (...message: unknown[]) => {
    console.warn(message);
  },
  error: (...message: unknown[]) => {
    console.error(message);
  }
};
