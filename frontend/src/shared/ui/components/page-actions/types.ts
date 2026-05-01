export interface PageBaseAction {
  type: string;
  meta?: Record<string, any>;
  payload?: any;
}

export interface PageButtonAction {
  id: string;
  name: string;
  type?: 'primary' | 'secondary' | 'danger';
  onClick?: () => void;
}

export interface PageButtonActionGroup {
  id: string;
  buttons: PageButtonAction[];
}

export interface PageActionVisibilityBase {
  [key: string]: boolean;
}

export type PageActionButtonVisibilityMapDef<TState, TVisibility extends PageActionVisibilityBase> = {
  [key: string]: (state: TState, visibility: TVisibility) => boolean;
};

type PageActionsBase<TVisibility extends PageActionVisibilityBase = PageActionVisibilityBase> = {
  actionsVisibility?: TVisibility;
  onAction: (action: PageBaseAction) => void;
};

export type PageBase<TState, TVisibility extends PageActionVisibilityBase = PageActionVisibilityBase> = {
  state: TState;
  actions: PageActionsBase<TVisibility>;
};

export interface PageActionsProps<TState, TVisibility extends PageActionVisibilityBase = PageActionVisibilityBase> {
  actionVisibilityMap: PageActionButtonVisibilityMapDef<TState, TVisibility>;
  buttons: PageButtonActionGroup;
  page: PageBase<TState, TVisibility>;
}

export interface ActionsPanelItem {
  groupId: string;
  name: string;
  disabled?: boolean;
  permissions?: string[];
  icon?: string;
  type?: 'primary' | 'secondary' | 'danger';
  childrens?: ActionsPanelItem[];
  action?: () => void;
}

export interface ActionsPanelCpsItem {
  groupId: string;
  title: string;
  disabled?: boolean;
  permissions?: string[];
  icon?: string;
  appearance?: 'primary' | 'secondary' | 'danger';
  children: ActionsPanelCpsItem[];
  onClick?: () => void;
}
