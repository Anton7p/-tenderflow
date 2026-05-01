import type { Page } from './page';
import type { PageState } from './page';

export interface PageUIComponentProps {
  page: Page;
}

export interface PageActionsVisibility {
  [key: string]: boolean;
  isUploadVisible: boolean;
  isCreateVisible: boolean;
  isEditVisible: boolean;
  isDeleteVisible: boolean;
  isGroupVisible: boolean;
  isExportVisible: boolean;
  isClearVisible: boolean;
}

export interface UsePageActionsVisibilityProps {
  state: PageState;
}
