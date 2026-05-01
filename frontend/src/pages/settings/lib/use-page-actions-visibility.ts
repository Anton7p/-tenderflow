import { useMemo } from 'react';
import type { PageActionsVisibility, UsePageActionsProps } from '../types';

export function usePageActionsVisibility(props: UsePageActionsProps): PageActionsVisibility {
  const { state } = props;
  return useMemo(
    () => ({
      isSaveVisible: Object.keys(state.settings).length > 0,
    }),
    [state.settings]
  );
}
