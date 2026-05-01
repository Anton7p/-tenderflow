import { useMemo } from 'react';
import type { PageActionsVisibility, PageState } from '../../types';

interface UsePageActionsVisibilityProps {
  state: PageState;
}

export function usePageActionsVisibility(props: UsePageActionsVisibilityProps): PageActionsVisibility {
  const { state } = props;

  const selectedCount = (state.selectedRowIds || []).length;
  const hasSelectedRows = selectedCount > 0;
  const hasSingleSelectedRow = selectedCount === 1;
  const hasMultipleSelectedRows = selectedCount > 1;
  const isFileLoaded = Boolean(state.isFileLoaded);

  return useMemo(
    () => ({
      isUploadVisible: true,
      isCreateVisible: isFileLoaded,
      isEditVisible: hasSingleSelectedRow,
      isDeleteVisible: hasSelectedRows,
      isGroupVisible: hasMultipleSelectedRows,
      isExportVisible: isFileLoaded,
      isClearVisible: isFileLoaded,
    }),
    [hasSingleSelectedRow, hasSelectedRows, hasMultipleSelectedRows, isFileLoaded]
  );
}
