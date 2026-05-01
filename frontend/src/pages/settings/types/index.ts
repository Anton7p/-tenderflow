export interface PageState {
  loading: boolean;
  settings: Record<string, any>;
}

export interface PageActions {
  setLoading: (loading: boolean) => void;
  setSettings: (settings: Record<string, any>) => void;
  actionsVisibility: PageActionsVisibility;
}

export interface Page {
  state: PageState;
  actions: PageActions;
}

export interface Store extends PageState {
  setLoading: (loading: boolean) => void;
  setSettings: (settings: Record<string, any>) => void;
}

export interface UsePageStateProps {
  store: Store;
}

export interface UsePageActionsProps {
  store: Store;
  state: PageState;
}

export interface PageActionsVisibility {
  isSaveVisible: boolean;
}
