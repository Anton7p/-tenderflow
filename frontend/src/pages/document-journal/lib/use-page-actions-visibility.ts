import { useMemo } from 'react';
import type { PageActionsVisibility, UsePageActionsProps } from '../types';

export function usePageActionsVisibility(props: UsePageActionsProps): PageActionsVisibility {
  const { state } = props;
  return useMemo(
    () => ({
      isRefreshVisible: state.documents.length > 0,
    }),
    [state.documents.length]
  );
}
