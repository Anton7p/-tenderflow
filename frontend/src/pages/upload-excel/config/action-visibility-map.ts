import { ActionsEnum } from './actions-enum';

import type { ActionVisibilityMap } from '../types';

export const actionVisibilityMap: ActionVisibilityMap = {
  [ActionsEnum.UPLOAD_EXCEL]: () => true,
  [ActionsEnum.CREATE_POSITION]: () => true,
  [ActionsEnum.EDIT_POSITION]: () => true,
  [ActionsEnum.EXPORT_WORD]: () => true,
  [ActionsEnum.GROUP_POSITIONS]: () => true,
  [ActionsEnum.DELETE]: () => true,
  [ActionsEnum.CLEAR]: () => true,
};
