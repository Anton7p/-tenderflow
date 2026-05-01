import { useMemo } from 'react';
import type { PageActionsVisibility, PageState } from '../../types';

interface UsePageActionsVisibilityProps {
  state: PageState;
}

export function usePageActionsVisibility(props: UsePageActionsVisibilityProps): PageActionsVisibility {
  const { state } = props;

  const hasSelectedRows = (state.selectedRowIds || []).length > 0;

  const hasMultipleSelectedRows = (state.selectedRowIds || []).length > 1;

  return useMemo(
    () => ({
      isUploadVisible: true,
      isDeleteVisible: hasSelectedRows,
      isCopyPositionsVisible: hasMultipleSelectedRows,
    }),
    [hasSelectedRows, hasMultipleSelectedRows]
  );
}
