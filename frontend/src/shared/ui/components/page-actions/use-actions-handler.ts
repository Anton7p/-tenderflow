import { useCallback } from 'react';

import type { PageBaseAction } from './types';

type HandlerFn = (action: PageBaseAction) => void;

type HandlersMap = Record<string, HandlerFn>;

export function useActionsHandler(handlers: HandlersMap) {
  return useCallback(
    (action: PageBaseAction) => {
      if (action.type) {
        handlers[action.type]?.(action);
      }
    },
    [handlers]
  );
}
