export interface PageState {
  loading: boolean;
  documents: any[];
  documentsEntity: {
    documents: any[];
    hasDocuments: boolean;
  };
}

export interface PageActions {
  setLoading: (loading: boolean) => void;
  setDocuments: (documents: any[]) => void;
  actionsVisibility: PageActionsVisibility;
}

export interface Page {
  state: PageState;
  actions: PageActions;
}

export interface Store {
  loading: boolean;
  documents: any[];
  setLoading: (loading: boolean) => void;
  setDocuments: (documents: any[]) => void;
}

export interface UsePageStateProps {
  store: Store;
}

export interface UsePageActionsProps {
  store: Store;
  state: PageState;
}

export interface PageActionsVisibility {
  isRefreshVisible: boolean;
}
