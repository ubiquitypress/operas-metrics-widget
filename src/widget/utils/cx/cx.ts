/**
 * A utility function to join class names, similar to the `classnames` package.
 */
export const cx = (...args: unknown[]) => {
  const classes: string[] = [];

  for (const arg of args) {
    const argType = typeof arg;

    if (!arg) {
      continue;
    }

    if (argType === 'string' || argType === 'number') {
      classes.push(arg as string);
    } else if (Array.isArray(arg)) {
      classes.push(...arg);
    } else if (argType === 'object') {
      for (const key in arg as Record<string, unknown>) {
        if ((arg as Record<string, unknown>)[key]) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(' ');
};
