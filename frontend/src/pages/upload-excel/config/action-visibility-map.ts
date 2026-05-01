import { ActionsEnum } from './actions-enum';

import type { ActionVisibilityMap } from '../types';

export const actionVisibilityMap: ActionVisibilityMap = {
  [ActionsEnum.UPLOAD_EXCEL]: () => true,
  [ActionsEnum.CREATE_POSITION]: (_state, visibility) => Boolean(visibility.isCreateVisible),
  [ActionsEnum.EDIT_POSITION]: (_state, visibility) => Boolean(visibility.isEditVisible),
  [ActionsEnum.EXPORT_WORD]: (_state, visibility) => Boolean(visibility.isExportVisible),
  [ActionsEnum.GROUP_POSITIONS]: (_state, visibility) => Boolean(visibility.isGroupVisible),
  [ActionsEnum.DELETE]: (_state, visibility) => Boolean(visibility.isDeleteVisible),
  [ActionsEnum.CLEAR]: (_state, visibility) => Boolean(visibility.isClearVisible),
};
