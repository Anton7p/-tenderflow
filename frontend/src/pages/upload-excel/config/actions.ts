import { ActionsEnum } from './actions-enum';

import type { PageButtonActionGroup } from '../../../shared/ui/components/page-actions';

export const actions: PageButtonActionGroup = {
  id: 'MAIN',
  buttons: [
    {
      id: ActionsEnum.UPLOAD_EXCEL,
      name: 'Загрузить Excel',
      type: 'primary',
    },
    {
      id: ActionsEnum.CREATE_POSITION,
      name: 'Создать позицию',
      type: 'secondary',
    },
    {
      id: ActionsEnum.EDIT_POSITION,
      name: 'Редактировать позицию',
      type: 'secondary',
    },
    {
      id: ActionsEnum.EXPORT_WORD,
      name: 'Выгрузить в Word',
      type: 'secondary',
    },
    {
      id: ActionsEnum.GROUP_POSITIONS,
      name: 'Сгруппировать позиции',
      type: 'secondary',
    },
    {
      id: ActionsEnum.DELETE,
      name: 'Удалить',
      type: 'danger',
    },
    {
      id: ActionsEnum.CLEAR,
      name: 'Очистить',
      type: 'secondary',
    },
  ],
};
