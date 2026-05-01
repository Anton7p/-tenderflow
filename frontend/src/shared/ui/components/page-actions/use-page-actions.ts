import { useCallback, useMemo } from 'react';

import { getActionButtons, isActionButtonVisible } from './helpers';

import type {
  PageBaseAction,
  PageButtonAction,
  PageButtonActionGroup,
  PageActionVisibilityBase,
  PageActionButtonVisibilityMapDef
} from './types';

type PageActionsBase<TVisibility extends PageActionVisibilityBase = PageActionVisibilityBase> = {
  actionsVisibility?: TVisibility;
  onAction: (action: PageBaseAction) => void;
};

export type PageBase<TState, TVisibility extends PageActionVisibilityBase = PageActionVisibilityBase> = {
  state: TState;
  actions: PageActionsBase<TVisibility>;
};

export type PageActionsConfig<TState, TVisibility extends PageActionVisibilityBase = PageActionVisibilityBase> = {
  actionVisibilityMap: PageActionButtonVisibilityMapDef<TState, TVisibility>;
  buttons: PageButtonActionGroup;
  page: PageBase<TState, TVisibility>;
};

export function usePageActions<TState, TVisibility extends PageActionVisibilityBase = PageActionVisibilityBase>(
  config: PageActionsConfig<TState, TVisibility>
) {
  const { buttons, actionVisibilityMap, page } = config;
  const { state, actions } = page;
  const { onAction } = actions;

  const actionsVisibility = actions.actionsVisibility;

  const handleAction = useCallback(
    (action: PageButtonAction) => {
      onAction({
        type: action.id,
        payload: action
      });
    },
    [onAction]
  );

  const buttonsData = useMemo(() => {
    return getActionButtons({
      groups: buttons,
      onAction: handleAction,
      visibilityFn: (item) => isActionButtonVisible(item, actionVisibilityMap, state, actionsVisibility)
    });
  }, [buttons, handleAction, actionVisibilityMap, state, actionsVisibility]);

  return useMemo(() => {
    return {
      groups: [{
        id: buttons.id,
        buttons: buttonsData.buttons
      }]
    };
  }, [buttons.id, buttonsData]);
}
