import type { PageButtonAction, PageActionVisibilityBase, PageActionButtonVisibilityMapDef } from './types';

interface GetActionButtonsParams {
  groups: { id: string; buttons: PageButtonAction[] };
  onAction: (action: PageButtonAction) => void;
  visibilityFn: (item: PageButtonAction) => boolean;
}

export function getActionButtons(
  params: GetActionButtonsParams
) {
  const { groups, onAction, visibilityFn } = params;
  
  return {
    ...groups,
    buttons: groups.buttons
      .filter((button) => visibilityFn(button))
      .map((button) => ({
        ...button,
        onClick: () => onAction(button),
      })),
  };
}

export function isActionButtonVisible<TState, TVisibility extends PageActionVisibilityBase>(
  item: PageButtonAction,
  actionVisibilityMap: PageActionButtonVisibilityMapDef<TState, TVisibility>,
  state: TState,
  actionsVisibility?: TVisibility
): boolean {
  const visibilityFn = actionVisibilityMap[item.id];
  if (!visibilityFn) {
    return true;
  }
  return visibilityFn(state, actionsVisibility || {} as TVisibility);
}
