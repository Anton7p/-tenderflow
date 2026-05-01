import { useMemo } from 'react';
import type { PageState, UsePageStateProps } from '../types';

export function usePageState(props: UsePageStateProps): PageState {
  const { store } = props;

  return useMemo(() => {
    const loading = store.loading;
    const documents = store.documents;
    return {
      loading,
      documents,
      documentsEntity: {
        documents,
        hasDocuments: documents.length > 0,
      },
    };
  }, [store.loading, store.documents]);
}
