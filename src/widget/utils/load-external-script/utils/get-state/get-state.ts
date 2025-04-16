import type { State } from '../../types';
import { STATE_ATTRIBUTE, StateMap } from '../../types';

export const getState = (element: Element): State | undefined => {
  // Get the data state of the script element
  const state = element.getAttribute(STATE_ATTRIBUTE);

  // If no state is found, return undefined
  if (!state) {
    return undefined;
  }

  // Check the state against the state map
  if (state in StateMap) {
    return state as State;
  }

  // Return the mapped state
  return undefined;
};
