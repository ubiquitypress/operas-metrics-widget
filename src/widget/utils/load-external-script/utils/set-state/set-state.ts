import type { State } from '../../types';
import { STATE_ATTRIBUTE } from '../../types';

export const setState = (element: Element, state: State) => {
  element.setAttribute(STATE_ATTRIBUTE, state);
};
